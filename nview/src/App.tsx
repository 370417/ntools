import { createSignal, Index } from 'solid-js';
import './App.css';
import { Replay, viewbox } from './assets/ntools_rs';

type Mine = {
    x: number;
    y: number;
    type: 0 | 1 | 2;
};

function App() {
    let replay: Replay | undefined = undefined;

    const [paused, setPaused] = createSignal(true);

    const [tilePath, setTilePath] = createSignal('');

    const [ninja, setNinja] = createSignal({ x: -50, y: -50 });

    const [mines, setMines] = createSignal([] as Mine[]);

    const viewboxVal = viewbox();

    const socket = new WebSocket('ws://localhost:8080');

    function tick() {
        if (!paused() && replay) {
            replay.tick(false, false, false, false);
            renderFrame(replay);
        }
        requestAnimationFrame(tick);
    }
    tick();

    function renderFrame(replay: Replay) {
        setNinja({
            x: replay.ninja_x(),
            y: replay.ninja_y(),
        });

        const minesArr: Mine[] = [];
        const minesLen = replay.mines_len();
        for (let i = 0; i < minesLen; i++) {
            minesArr.push({
                x: replay.mine_x(i),
                y: replay.mine_y(i),
                type: replay.mine_state(i) as 0 | 1 | 2,
            });
        }
        setMines(minesArr);
    }

    socket.addEventListener('message', event => {
        const data: Blob = event.data;
        data.bytes().then(bytes => {
            replay?.free();
            replay = Replay.from_attract(bytes);
            const path = replay.tiles_path();
            setTilePath(path);
            renderFrame(replay);
        });
    });

    return (
        <>
            <svg viewBox={viewboxVal} width="1200">
                <defs>
                    <g id="toggled">
                        <circle r="4" fill="none" stroke="pink" />
                    </g>
                    <g id="untoggled">
                        <circle r="3.5" fill="none" stroke="blue" />
                    </g>
                    <g id="toggling">
                        <circle r="4.5" fill="none" stroke="pink" />
                    </g>
                </defs>
                <Index each={mines()}>
                    {(mine) => <use href={["#toggled", "#untoggled", "#toggling"][mine().type]} x={mine().x} y={mine().y} />}
                </Index>
                <circle cx={ninja().x} cy={ninja().y} r="10" fill="none" stroke="red" />
                <path d={tilePath()} stroke="red" fill-rule="evenodd" />
            </svg>
            <div>
                <div>
                    <input type="button" value="⏺" />
                </div>
                <div>
                    <input type="button" value={"▶⏸"} onclick={() => {
                        setPaused(!paused());
                    }} />
                </div>
                <div>
                    <input type="range" />
                </div>
            </div>
        </>
    )
}

export default App
