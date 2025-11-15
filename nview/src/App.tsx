import { createSignal } from 'solid-js';
import './App.css';
import { get_level_name, get_path, viewbox } from './assets/ntools_rs';

function App() {
    const [tilePath, setTilePath] = createSignal('');

    const viewboxVal = viewbox();

    const socket = new WebSocket('ws://localhost:8080');

    socket.addEventListener('message', event => {
        const data: Blob = event.data;
        data.bytes().then(bytes => {
            const path = get_path(bytes);
            setTilePath(path);

            console.log('Level name', get_level_name(bytes));
        });
    });

    return (
        <>
            <svg viewBox={viewboxVal} width="800">
                <path d={tilePath()} stroke="red" fill-rule="evenodd" />
            </svg>
        </>
    )
}

export default App
