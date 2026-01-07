import { createSignal, Show, type Accessor, type Setter } from 'solid-js';
import { Editor, get_anim_state, Replay, set_anim_data } from './assets/ntools_rs';
import { EditorApp } from './Editor.tsx';
import { ReplayApp } from './Replay.tsx';
import { loadAnimData, loadMap, saveAnimData } from './localstorage.ts';

export type GlobalEventState = {
    isJump1Pressed: Accessor<boolean>,
    isJump2Pressed: Accessor<boolean>,
    isRightPressed: Accessor<boolean>,
    isLeftPressed: Accessor<boolean>,
    isSuicidePressed: Accessor<boolean>,
    mouseGamePos: Accessor<{ x: number, y: number }>,
    setMouseGamePos: Setter<{ x: number, y: number }>,
};

export function App() {
    const editor = Editor.new();
    const [replay, setReplay] = createSignal<Replay>();
    const [levelName, setLevelName] = createSignal('');
    const [roundCorners, setRoundCorners] = createSignal(false);

    // manage past ninja state here so that we can better control when it gets updated
    const [pastNinjas, setPastNinjas] = createSignal<{ x: number, y: number }[]>([]);
    function updatePastNinjas() {
        const pastNinjas: { x: number, y: number }[] = [];
        const len = editor.past_ninjas_len();
        for (let i = 0; i < len; i++) {
            pastNinjas.push({
                x: editor.past_ninja_x(i),
                y: editor.past_ninja_y(i),
            });
        }
        setPastNinjas(pastNinjas);
    }

    // manage input state here so that keys pressed in the editor get registered
    // correctly when transitioning to gameplay
    const [isJump1Pressed, setIsJump1Pressed] = createSignal(false);
    const [isJump2Pressed, setIsJump2Pressed] = createSignal(false);
    const [isRightPressed, setIsRightPressed] = createSignal(false);
    const [isLeftPressed, setIsLeftPressed] = createSignal(false);
    const [isSuicidePressed, setIsSuicidePressed] = createSignal(false);
    // units are in game units, not pixels
    // same as svg units
    const [mouseGamePos, setMouseGamePos] = createSignal({ x: 36, y: 36 });

    const globalEventState: GlobalEventState = {
        isJump1Pressed,
        isJump2Pressed,
        isRightPressed,
        isLeftPressed,
        isSuicidePressed,
        mouseGamePos,
        setMouseGamePos,
    };

    // if (location.hostname === 'localhost') {
    //     fetch('http://localhost:8080').then(response => {
    //         return response.arrayBuffer();
    //     }).then(arrayBuffer => {
    //         editor.load_attract(new Uint8Array(arrayBuffer));
    //         setLevelName(editor.get_level_name());
    //     });
    // }

    loadMap(editor);
    setLevelName(editor.get_level_name());

    document.addEventListener('keydown', event => {
        if (event.ctrlKey || event.metaKey) {
            return;
        }

        if (event.code === 'Tab') {
            const $replay = replay();
            if ($replay) {
                setReplay(undefined);
                $replay.send_past_ninjas();
                editor.receive_past_ninjas();
                $replay.free();
                updatePastNinjas();
            } else {
                setReplay(editor.to_replay(roundCorners()));
            }
            event.preventDefault();
        }

        else if (event.code === 'KeyZ') setIsJump1Pressed(true);
        else if (event.code === 'ArrowUp') setIsJump2Pressed(true);
        else if (event.code === 'ArrowRight') setIsRightPressed(true);
        else if (event.code === 'ArrowLeft') setIsLeftPressed(true);
        else if (event.code === 'KeyV') setIsSuicidePressed(true);
    });

    document.addEventListener('keyup', event => {
        if (event.code === 'KeyZ') setIsJump1Pressed(false);
        else if (event.code === 'ArrowUp') setIsJump2Pressed(false);
        else if (event.code === 'ArrowRight') setIsRightPressed(false);
        else if (event.code === 'ArrowLeft') setIsLeftPressed(false);
        else if (event.code === 'KeyV') setIsSuicidePressed(false);
    });

    document.addEventListener('blur', () => {
        setIsJump1Pressed(false);
        setIsJump2Pressed(false);
        setIsRightPressed(false);
        setIsLeftPressed(false);
        setIsSuicidePressed(false);
    });

    loadAnimData();
    const ANIM_VALID = 0;
    const ANIM_INVALID = 1;
    const ANIM_MISSING = 2;
    // Set initial state to only be valid or missing.
    // We avoid setting state to invalid at first because it is confusing
    // for the user to see an error message before interacating with the page.
    const [animState, setAnimState] = createSignal(get_anim_state() == ANIM_VALID ? ANIM_VALID : ANIM_MISSING);

    return <>
        <Show when={animState() != ANIM_VALID}>
            <label style={{ display: 'inline-block', height: '100%', padding: '3em', color: 'var(--main-menu-text)' }}>
                <p>Select your copy of anim_data_line_new.txt.bin to get started.</p>
                <input type="file" onchange={function(this: HTMLInputElement) {
                    const files = this.files;
                    if (files && files.length > 0) {
                        const fileReader = new FileReader();
                        fileReader.onloadend = () => {
                            if (fileReader.result instanceof ArrayBuffer) {
                                const data = new Uint8Array(fileReader.result);
                                try {
                                    saveAnimData(data);
                                    set_anim_data(data);
                                    setAnimState(get_anim_state());
                                } catch (e) {
                                    setAnimState(ANIM_INVALID);
                                }
                            }
                        };
                        fileReader.readAsArrayBuffer(files[0]);
                    }
                }} />
                <dl>
                    <dt>Windows</dt>
                    <dd>{"C:\\Program Files (x86)\\Steam\\steamapps\\common\\N++\\anim_data_line_new.txt.bin"}</dd>
                    <dt>Linux</dt>
                    <dd>{"~/.steam/steam/steamapps/common/N++/anim_data_line_new.txt.bin"}</dd>
                    <dt>Mac</dt>
                    <dd>{"~/Library/Application Support/Steam/steamapps/common/N++/N++.app/Contents/Resources/NPP/anim_data_line_new.txt.bin"}</dd>
                </dl>
                <Show when={animState() == ANIM_INVALID}>
                    <p>Invalid file.</p>
                </Show>
            </label>
        </Show>
        <Show when={animState() == ANIM_VALID && !replay()}>
            <EditorApp
                editor={editor}
                pastNinjas={pastNinjas}
                globalEventState={globalEventState}
                levelName={levelName}
                setLevelName={setLevelName}
                roundCorners={roundCorners}
                setRoundCorners={setRoundCorners}
            />
        </Show>
        <Show when={animState() == ANIM_VALID && !!replay()} keyed>
            <ReplayApp replay={replay()!} globalEventState={globalEventState} />
        </Show>
    </>;
}
