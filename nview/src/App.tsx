import { createSignal, Show } from 'solid-js';
import { Editor, Replay } from './assets/ntools_rs';
import { EditorApp } from './Editor.tsx';
import { ReplayApp } from './Replay.tsx';

export function App() {
    const editor = Editor.new();
    const [replay, setReplay] = createSignal<Replay>();

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
                $replay.free();
            } else {
                setReplay(editor.to_replay());
            }
        }
    });

    return <>
        <Show when={!replay()}>
            <EditorApp editor={editor} />
        </Show>
        <Show when={!!replay()} keyed>
            <ReplayApp replay={replay as any} />
        </Show>
    </>;
}
