import { createSignal } from 'solid-js';
import './App.css';
import { Replay, viewbox } from './assets/ntools_rs';

function App() {
    let replay: Replay | undefined = undefined;

    const [tilePath, setTilePath] = createSignal('');

    const [frame, setFrame] = createSignal(0);

    const [ninja, setNinja] = createSignal({ x: -50, y: -50 });

    const viewboxVal = viewbox();

    const socket = new WebSocket('ws://localhost:8080');

    socket.addEventListener('message', event => {
        const data: Blob = event.data;
        data.bytes().then(bytes => {
            replay?.free();
            replay = Replay.from_attract(bytes);
            const path = replay.tiles_path();
            setTilePath(path);
            setNinja({
                x: replay.ninja_x(),
                y: replay.ninja_y(),
            });
        });
    });

    return (
        <>
            <svg viewBox={viewboxVal} width="1200">
                <path d={tilePath()} stroke="red" fill-rule="evenodd" />
                <circle cx={ninja().x} cy={ninja().y} r="10" fill="none" stroke="red" />
            </svg>
        </>
    )
}

export default App
