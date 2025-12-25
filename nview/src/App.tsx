import { createSignal, Show, type Accessor, type Setter } from 'solid-js';
import { Editor, Replay } from './assets/ntools_rs';
import { EditorApp } from './Editor.tsx';
import { ReplayApp } from './Replay.tsx';
import { loadMap } from './localstorage.ts';

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
                setReplay(editor.to_replay());
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

    return <>
        <Show when={!replay()}>
            <EditorApp editor={editor} pastNinjas={pastNinjas} globalEventState={globalEventState} levelName={levelName} setLevelName={setLevelName} />
        </Show>
        <Show when={!!replay()} keyed>
            <ReplayApp replay={replay()!} globalEventState={globalEventState} />
        </Show>
    </>;
}
