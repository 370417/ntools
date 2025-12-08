import { createSignal, Index } from 'solid-js';
import { Replay } from './assets/ntools_rs';
import { Scrubber } from './Scrubber';
import Stats from 'stats-js';
import { LaunchPads, updateLaunchPads, type LaunchPadData } from './entities/LaunchPad';
import { MineDefs, Mines, updateMines, type MineData } from './entities/Mine';

type BounceBlock = {
    x: number;
    y: number;
    deg: number;
};

type OneWay = {
    x: number;
    y: number;
    deg: number;
};

type BoostPad = {
    x: number;
    y: number;
    deg: number;
    anim: number;
};

type ExitDoor = {
    x: number;
    y: number;
};

type ExitSwitch = {
    x: number;
    y: number;
}

type Thwump = {
    x: number;
    y: number;
    deg: number;
};

const LIMBS = [[0, 12], [1, 12], [2, 8], [3, 9], [4, 10], [5, 11], [6, 7], [8, 0], [9, 0], [10, 1], [11, 1]];

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

// OneWay
const oneWayHalfWidth = 12;
const oneWayHalfWidthSmall = 9;
const oneWayLineSpacing = 3;

// BoostPad
const boostPadLong = 6;
const boostPadMid = 1;
const boostPadShort = -4;

// Exit
const exitDoorRadius = 10;
const exitDoorCorner = 2.5;
const exitSwitchHalfWidth = 7;
const exitSwitchHalfHeight = 4.5;
const exitSwitchCorner = 2;

function App() {
    let replay: Replay | undefined = undefined;

    const [recording, setRecording] = createSignal(false);
    const [isPlaying, setIsPlaying] = createSignal(false);
    // If dragging dragStart is the progress value (frame) that the drag started at.
    // If not dragging, dragStart is undefined.
    const [dragStart, setDragStart] = createSignal<number | undefined>(undefined);
    const [replayLength, setReplayLength] = createSignal(0);
    const [progress, setProgress] = createSignal(0);
    const [previewProgress, setPreviewProgress] = createSignal<number | undefined>(undefined);

    const [isJump1Pressed, setIsJump1Pressed] = createSignal(false);
    const [isJump2Pressed, setIsJump2Pressed] = createSignal(false);
    const [isRightPressed, setIsRightPressed] = createSignal(false);
    const [isLeftPressed, setIsLeftPressed] = createSignal(false);
    const [isSuicidePressed, setIsSuicidePressed] = createSignal(false);

    // units are in game units, not pixels
    // same as svg units
    const [mouseGamePos, setMouseGamePos] = createSignal({ x: 0, y: 0 });

    document.addEventListener('keydown', event => {
        if (event.code === 'KeyZ') setIsJump1Pressed(true);
        else if (event.code === 'ArrowUp') setIsJump2Pressed(true);
        else if (event.code === 'ArrowRight') setIsRightPressed(true);
        else if (event.code === 'ArrowLeft') setIsLeftPressed(true);
        else if (event.code === 'KeyV') setIsSuicidePressed(true);

        else if (event.code === 'Enter') {
            replay?.place_ninja(mouseGamePos().x, mouseGamePos().y);
            if (replay && !isPlaying()) {
                renderFrame(replay, 1);
            }
        }
    });

    document.addEventListener('keyup', event => {
        if (event.code === 'KeyZ') setIsJump1Pressed(false);
        else if (event.code === 'ArrowUp') setIsJump2Pressed(false);
        else if (event.code === 'ArrowRight') setIsRightPressed(false);
        else if (event.code === 'ArrowLeft') setIsLeftPressed(false);
        else if (event.code === 'KeyV') setIsSuicidePressed(false);
    });

    let stats: any = undefined;
    // stats = new Stats();
    stats?.showPanel(0);
    if (stats) document.body.appendChild(stats.dom);

    const [tilePath, setTilePath] = createSignal('');

    const [ninja, setNinja] = createSignal({ x: -50, y: -50 });
    const [ninjaPreview, setNinjaPreview] = createSignal({ x: -50, y: -50 });

    const [ninjaBones, setNinjaBones] = createSignal<Float32Array<ArrayBufferLike> | undefined>(undefined);
    const [ninjaPreviewBones, setNinjaPreviewBones] = createSignal<Float32Array<ArrayBufferLike> | undefined>(undefined);

    const mines = createSignal<MineData[]>([]);
    const [bounceBlocks, setBounceBlocks] = createSignal<BounceBlock[]>([]);
    const [oneWays, setOneWays] = createSignal<OneWay[]>([]);
    const [boostPads, setBoostPads] = createSignal<BoostPad[]>([]);
    const [exitDoors, setExitDoors] = createSignal<ExitDoor[]>([]);
    const [exitSwitches, setExitSwitches] = createSignal<ExitSwitch[]>([]);
    const [thwumps, setThwumps] = createSignal<Thwump[]>([]);
    const launchPads = createSignal<LaunchPadData[]>([]);

    const socket = new WebSocket('ws://localhost:8080');

    let timeMs = performance.now();
    const fps = 60;
    const msPerTick = 1000 / fps;
    let accumulator = 0;
    function tick() {
        stats?.begin();
        const newTimeMs = performance.now();
        const frameTimeMs = Math.min(newTimeMs - timeMs, 250);
        timeMs = newTimeMs;

        let partialFrame = 1;

        if (isPlaying() && dragStart() === undefined && replay) {
            if (recording() || progress() < replayLength()) {

                accumulator += frameTimeMs;

                while (accumulator >= msPerTick) {
                    if (recording()) {
                        replay.set_input(isJump1Pressed() || isJump2Pressed(), isRightPressed(), isLeftPressed(), isSuicidePressed());
                    }
                    replay.tick();
                    accumulator -= msPerTick;
                }
                partialFrame = accumulator / msPerTick;

                setProgress(replay.progress());
            } else if (progress() < replayLength()) {
                replay.tick();
                setProgress(replay.progress());
            } else {
                setIsPlaying(false);
            }
            renderFrame(replay, partialFrame);
        }
        stats?.end();
        requestAnimationFrame(tick);
    }
    tick();

    function renderFrame(replay: Replay, partialFrame: number) {
        setNinja({
            x: replay.ninja_x(partialFrame),
            y: replay.ninja_y(partialFrame),
        });
        setNinjaPreview({
            x: replay.ninja_preview_x(partialFrame),
            y: replay.ninja_preview_y(partialFrame),
        });
        setNinjaBones(replay.ninja_bones(partialFrame));
        if (previewProgress() === undefined) {
            setNinjaPreviewBones(undefined);
        } else {
            setNinjaPreviewBones(replay.ninja_preview_bones(partialFrame));
        }

        updateMines(mines, replay);

        const bounceBlocksArr: BounceBlock[] = [];
        const bounceBlocksLen = replay.bounce_blocks_len();
        for (let i = 0; i < bounceBlocksLen; i++) {
            bounceBlocksArr.push({
                x: replay.bounce_block_x(i, partialFrame),
                y: replay.bounce_block_y(i, partialFrame),
                deg: replay.bounce_block_deg(i),
            });
        }
        setBounceBlocks(bounceBlocksArr);

        const oneWaysArr: OneWay[] = [];
        const oneWaysLen = replay.one_ways_len();
        for (let i = 0; i < oneWaysLen; i++) {
            oneWaysArr.push({
                x: replay.one_way_x(i),
                y: replay.one_way_y(i),
                deg: replay.one_way_deg(i),
            });
        }
        setOneWays(oneWaysArr);

        const boostPadsArr: BoostPad[] = [];
        const boostPadsLen = replay.boost_pads_len();
        for (let i = 0; i < boostPadsLen; i++) {
            boostPadsArr.push({
                x: replay.boost_pad_x(i),
                y: replay.boost_pad_y(i),
                deg: replay.boost_pad_rotation(i, partialFrame),
                anim: replay.boost_pad_anim_progress(i, partialFrame),
            });
        }
        setBoostPads(boostPadsArr);

        const exitDoorsArr: ExitDoor[] = [];
        const exitDoorsLen = replay.exit_doors_len();
        for (let i = 0; i < exitDoorsLen; i++) {
            exitDoorsArr.push({
                x: replay.exit_door_x(i),
                y: replay.exit_door_y(i),
            });
        }
        setExitDoors(exitDoorsArr);

        const exitSwitchesArr: ExitSwitch[] = [];
        const exitSwitchesLen = replay.exit_switches_len();
        for (let i = 0; i < exitSwitchesLen; i++) {
            exitSwitchesArr.push({
                x: replay.exit_switch_x(i),
                y: replay.exit_switch_y(i),
            });
        }
        setExitSwitches(exitSwitchesArr);

        const thwumpsArr: Thwump[] = [];
        const thwumpsLen = replay.thwumps_len();
        for (let i = 0; i < thwumpsLen; i++) {
            thwumpsArr.push({
                x: replay.thwump_x(i, partialFrame),
                y: replay.thwump_y(i, partialFrame),
                deg: replay.thwump_deg(i),
            });
        }
        setThwumps(thwumpsArr);

        updateLaunchPads(launchPads, replay);

        setReplayLength(replay.replay_length());
    }

    socket.addEventListener('message', event => {
        const data: Blob = event.data;
        data.bytes().then(bytes => {
            replay?.free();
            replay = Replay.from_attract(bytes);
            const path = replay.tiles_path();
            setTilePath(path);
            renderFrame(replay, 1);
        });
    });

    return (
        <>
            <svg viewBox="0 0 1056 600" onmousemove={function(this: SVGElement, event) {
                const { left, top, width, height } = this.getBoundingClientRect();
                setMouseGamePos({
                    x: (event.clientX - left) / width * 1056,
                    y: (event.clientY - top) / height * 600,
                });
            }}>
                <defs>
                    <clipPath id="tiles-clip">
                        <use href="#tiles" />
                    </clipPath>
                    <MineDefs />
                    <g id="bounceblock">
                        <path id="bounceblockFill" d={bounceBlockPath} />
                        <path id="bounceblockStroke" d={bounceBlockStrokePath} fill="none" stroke-width={bounceBlockStroke} />
                    </g>
                    <g id="oneway">
                        <line class="long" x1={-oneWayHalfWidth} y1="0" x2={oneWayHalfWidth} y2="0" stroke-linecap="butt" />
                        <line class="short" x1={-oneWayHalfWidthSmall} y1={oneWayLineSpacing} x2={oneWayHalfWidthSmall} y2={oneWayLineSpacing} stroke-linecap="butt" />
                    </g>
                    <g id="boostpad" stroke-width="1.25">
                        <line x1={boostPadLong} y1={boostPadShort} x2={-boostPadShort} y2={-boostPadLong} />
                        <line x1={boostPadLong} y1={boostPadMid} x2={-boostPadMid} y2={-boostPadLong} />
                        <line x1={boostPadLong} y1={boostPadLong} x2={-boostPadLong} y2={-boostPadLong} />
                        <line x1={boostPadMid} y1={boostPadLong} x2={-boostPadLong} y2={-boostPadMid} />
                        <line x1={boostPadShort} y1={boostPadLong} x2={-boostPadLong} y2={-boostPadShort} />
                    </g>
                    <g id="thwump">
                        <path stroke="black" fill="none" d={`M 8.5 8.5 H -8.5 V -8.5 H 8.5`} />
                    </g>
                </defs>
                <Index each={exitDoors()}>
                    {exitDoor => <>
                        <path class="exit-door" d={`M ${exitDoor().x} ${exitDoor().y} v ${-exitDoorRadius} h ${-exitDoorRadius + exitDoorCorner} l ${-exitDoorCorner} ${exitDoorCorner} v ${2 * (exitDoorRadius - exitDoorCorner)} l ${exitDoorCorner} ${exitDoorCorner} h ${exitDoorRadius - exitDoorCorner} z`} />
                        <path class="exit-door" d={`M ${exitDoor().x} ${exitDoor().y} v ${-exitDoorRadius} h ${exitDoorRadius - exitDoorCorner} l ${exitDoorCorner} ${exitDoorCorner} v ${2 * (exitDoorRadius - exitDoorCorner)} l ${-exitDoorCorner} ${exitDoorCorner} h ${-exitDoorRadius + exitDoorCorner} z`} />
                        <path class="exit-door-stroke" stroke-width="3" fill="none" stroke-linecap="round" d={`M ${exitDoor().x} ${exitDoor().y} m 0 ${(1 - 0) * exitDoorRadius} v ${(0) * exitDoorRadius} h ${-exitDoorRadius + exitDoorCorner} l ${-exitDoorCorner} ${-exitDoorCorner} v ${(1 - 0) * (-exitDoorRadius + exitDoorCorner)}`} />
                        <path class="exit-door-stroke" stroke-width="3" fill="none" stroke-linecap="round" d={`M ${exitDoor().x} ${exitDoor().y} m 0 ${(1 - 0) * exitDoorRadius} v ${(0) * exitDoorRadius} h ${exitDoorRadius - exitDoorCorner} l ${exitDoorCorner} ${-exitDoorCorner} v ${(1 - 0) * (-exitDoorRadius + exitDoorCorner)}`} />
                    </>}
                </Index>
                <Index each={oneWays()}>
                    {oneWay => <use href="#oneway" x={oneWay().x} y={oneWay().y} transform={`rotate(${oneWay().deg},${oneWay().x},${oneWay().y})`} />}
                </Index>
                <Mines mines={mines} />
                <Index each={exitSwitches()}>
                    {exitSwitch => <>
                        <path class="exit-switch" d={`M ${exitSwitch().x} ${exitSwitch().y} m ${-exitSwitchHalfWidth + exitSwitchCorner} ${-exitSwitchHalfHeight} h ${2 * (exitSwitchHalfWidth - exitSwitchCorner)} l ${exitSwitchCorner} ${exitSwitchCorner} v ${2 * (exitSwitchHalfHeight - exitSwitchCorner)} l ${-exitSwitchCorner} ${exitSwitchCorner} h ${2 * (-exitSwitchHalfWidth + exitSwitchCorner)} l ${-exitSwitchCorner} ${-exitSwitchCorner} v ${2 * (-exitSwitchHalfHeight + exitSwitchCorner)} l ${exitSwitchCorner} ${-exitSwitchCorner}`} />
                    </>}
                </Index>
                <LaunchPads launchPads={launchPads} />
                <Index each={thwumps()}>
                    {thwump => <use href="#thwump" x={thwump().x} y={thwump().y} transform={`rotate(${thwump().deg},${thwump().x},${thwump().y})`} />}
                </Index>
                <Index each={bounceBlocks()}>
                    {bounceBlock => <use href="#bounceblock" x={bounceBlock().x} y={bounceBlock().y} transform={`rotate(${bounceBlock().deg},${bounceBlock().x},${bounceBlock().y})`} />}
                </Index>
                <Index each={boostPads()}>
                    {boostPad => <use href="#boostpad" x={boostPad().x} y={boostPad().y} stroke={`color-mix(in srgb-linear, var(--boost-pad) ${boostPad().anim * 100}%, var(--boost-pad-wooshing))`} transform={`rotate(${boostPad().deg},${boostPad().x},${boostPad().y})`} />}
                </Index>
                <path class="ninja preview" d={(() => {
                    let { x, y } = ninjaPreview();
                    let bones = ninjaPreviewBones();
                    if (!bones) return '';
                    return LIMBS.map(([i1, i2]) => {
                        const x1 = x + 20 * bones[i1];
                        const y1 = y + 20 * bones[i1 + 13];
                        const x2 = x + 20 * bones[i2];
                        const y2 = y + 20 * bones[i2 + 13];
                        return `M ${x1} ${y1} L ${x2} ${y2}`;
                    }).join(' ');
                })()} stroke-linejoin="round" stroke-linecap="round" stroke-width={2 / 44 * 24} />
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
                <path id="tiles" stroke-width="2" clip-path="url(#tiles-clip)" clip-rule="evenodd" d={tilePath()} fill-rule="evenodd" />
            </svg>
            <div>
                <Scrubber
                    recording={recording}
                    setRecording={setRecording}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    dragStart={dragStart}
                    setDragStart={setDragStart}
                    length={replayLength}
                    progress={progress}
                    previewProgress={previewProgress}
                    seek={frame => {
                        setProgress(frame);
                        if (replay) {
                            replay.seek(frame);
                            renderFrame(replay, 1);
                        }
                    }}
                    previewSeek={frame => {
                        setPreviewProgress(frame);
                        if (replay) {
                            if (frame !== undefined && dragStart() === undefined) {
                                replay.seek_preview(frame);
                            }
                            renderFrame(replay, 1);
                        }
                    }}
                />
            </div>
        </>
    )
}

export default App
