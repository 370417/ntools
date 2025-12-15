import { createSignal, Show } from 'solid-js';
import { Editor, Replay } from './assets/ntools_rs';
import { EditorApp } from './Editor.tsx';
import { ReplayApp } from './Replay.tsx';

export function App() {
    const editor = Editor.new();
    const [replay, setReplay] = createSignal<Replay>();

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

    if (location.hostname === 'localhost') {
        fetch('http://localhost:8080').then(response => {
            return response.arrayBuffer();
        }).then(arrayBuffer => {
            editor.load_attract(new Uint8Array(arrayBuffer));
        });
    }

    document.addEventListener('keydown', event => {
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
    });

    return <>
        <Show when={!replay()}>
            <EditorApp editor={editor} pastNinjas={pastNinjas} />
        </Show>
        <Show when={!!replay()} keyed>
            <ReplayApp replay={replay()!} />
        </Show>
    </>;
}
