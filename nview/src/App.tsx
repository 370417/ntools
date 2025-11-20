import { createSignal, Index } from 'solid-js';
import { Replay, viewbox } from './assets/ntools_rs';
import { Scrubber } from './Scrubber';

type Mine = {
    x: number;
    y: number;
    type: 0 | 1 | 2;
};

type BounceBlock = {
    x: number;
    y: number;
};

const LIMBS = [[0, 12], [1, 12], [2, 8], [3, 9], [4, 10], [5, 11], [6, 7], [8, 0], [9, 0], [10, 1], [11, 1]];

// Mine
// In 1080p, mine spoke diameter is 15
const spokeRadius = 15 / 2 * 24 / 44;
const spokeDiag = spokeRadius / Math.pow(2, 0.5);
const spokeWidth = 2.5 * 24 / 44;
const mineInnerRadius = 3.5 * 24 / 44;
const mineOuterRadius = 5 * 24 / 44;
const toggleRadius = 5 * 24 / 44;
const toggleThickness = 2 * 24 / 44;

// Bounceblock
// In 1080p:
// <path d="M -18 -18 L 18 -18 L 18 18 L -18 18 Z" />
const n17 = 17 * 24 / 44;
const n17a = 4 * 24 / 44;
const n17b = 10 * 24 / 44;
const n18 = 18 * 24 / 44;
const bounceBlockPath = `M -${n18} -${n18} L ${n18} -${n18} L ${n18} ${n18} L -${n18} ${n18} Z`;
// I would use svg's stroke dasharray to make the dashed lines, but they result in artifacts
// at corners, so instead we recreate the effect with a path.
const bounceBlockStrokePath = `M -${n17} ${n17b} V ${n17} H -${n17b} M -${n17a} ${n17} H ${n17a} M ${n17b} ${n17} H ${n17} V ${n17b} M ${n17} ${n17a} V -${n17a} M ${n17} -${n17b} V -${n17} H ${n17b} M ${n17a} -${n17} H -${n17a} M -${n17b} -${n17} H -${n17} V -${n17b} M -${n17} -${n17a} V ${n17a}`;
const bounceBlockStroke = 2 * 24 / 44;

function App() {
    let replay: Replay | undefined = undefined;

    const [paused, setPaused] = createSignal(true);

    const [scrubberState, setScrubberState] = createSignal<'play' | 'pause' | 'drag-playing' | 'drag-paused'>('pause');
    const [replayLength, setReplayLength] = createSignal(0);
    const [progress, setProgress] = createSignal(0);
    const [previewProgress, setPreviewProgress] = createSignal(0);

    function onSeek(frame: number) {
        if (replay) {
            replay.seek(frame);
            renderFrame(replay);
        }
    }

    const [tilePath, setTilePath] = createSignal('');

    const [ninja, setNinja] = createSignal({ x: -50, y: -50 });

    const [ninjaBones, setNinjaBones] = createSignal<Float32Array<ArrayBufferLike> | undefined>(undefined);

    const [mines, setMines] = createSignal<Mine[]>([]);

    const [bounceBlocks, setBounceBlocks] = createSignal<BounceBlock[]>([]);

    const viewboxVal = viewbox();

    const socket = new WebSocket('ws://localhost:8080');

    function tick() {
        if (!paused() && replay) {
            replay.tick();
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
        setNinjaBones(replay.ninja_bones());

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

        const bounceBlocksArr: BounceBlock[] = [];
        const bounceBlocksLen = replay.bounce_blocks_len();
        for (let i = 0; i < bounceBlocksLen; i++) {
            bounceBlocksArr.push({
                x: replay.bounce_block_x(i),
                y: replay.bounce_block_y(i),
            });
        }
        setBounceBlocks(bounceBlocksArr);

        setProgress(replay.progress());
        setReplayLength(replay.replay_length());
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
                        <line stroke-linecap="round" stroke-width={spokeWidth} x1={-spokeRadius} y1={0} x2={spokeRadius} y2={0} />
                        <line stroke-linecap="round" stroke-width={spokeWidth} x1={0} y1={-spokeRadius} x2={0} y2={spokeRadius} />
                        <line stroke-linecap="round" stroke-width={spokeWidth} x1={-spokeDiag} y1={-spokeDiag} x2={spokeDiag} y2={spokeDiag} />
                        <line stroke-linecap="round" stroke-width={spokeWidth} x1={-spokeDiag} y1={spokeDiag} x2={spokeDiag} y2={-spokeDiag} />
                        <circle id="mineOuter" r={mineOuterRadius} />
                        <circle id="mineInner" r={mineInnerRadius} />
                    </g>
                    <g id="untoggled">
                        <circle r={toggleRadius} stroke-width={toggleThickness} fill="none" />
                    </g>
                    <g id="toggling">
                        <circle r={toggleRadius} stroke-width={toggleThickness} fill="none" />
                    </g>
                    <g id="bounceblock">
                        <path id="bounceblockFill" d={bounceBlockPath} />
                        <path id="bounceblockStroke" d={bounceBlockStrokePath} fill="none" stroke-width={bounceBlockStroke} />
                    </g>
                </defs>
                <Index each={mines()}>
                    {(mine) => <use href={["#toggled", "#untoggled", "#toggling"][mine().type]} x={mine().x} y={mine().y} />}
                </Index>
                <Index each={bounceBlocks()}>
                    {(bounceBlock) => <use href="#bounceblock" x={bounceBlock().x} y={bounceBlock().y} />}
                </Index>
                <path class="ninja" d={(() => {
                    let { x, y } = ninja();
                    let bones = ninjaBones();
                    if (!bones) return '';
                    return LIMBS.map(([i1, i2]) => {
                        const x1 = x + 20 * bones[i1];
                        const y1 = y + 20 * bones[i1 + 13];
                        const x2 = x + 20 * bones[i2];
                        const y2 = y + 20 * bones[i2 + 13];
                        return `M ${x1} ${y1} L ${x2} ${y2}`;
                    }).join(' ');
                })()} stroke-linejoin="round" stroke-linecap="round" stroke-width={2 / 44 * 24} />
                <path id="tiles" d={tilePath()} fill-rule="evenodd" />
            </svg>
            <div>
                <Scrubber
                    state={[scrubberState, setScrubberState]}
                    length={replayLength}
                    progress={progress}
                    previewProgress={previewProgress}
                    onSeek={onSeek}
                    onSeekPreview={() => {}}
                />
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
