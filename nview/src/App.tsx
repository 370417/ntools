import { createSignal, Index } from 'solid-js';
import { Replay } from './assets/ntools_rs';
import { Scrubber } from './Scrubber';
// import Stats from 'stats-js';
import { LaunchPads, updateLaunchPads, type LaunchPadData } from './entities/LaunchPad';
import { MineDefs, Mines, updateMines, type MineData } from './entities/Mine';
import { OneWayDefs, OneWays, updateOneWays, type OneWayData } from './entities/OneWay';
import { BounceBlockDefs, BounceBlocks, updateBounceBlocks, type BounceBlockData } from './entities/BounceBlock';
import { Floorguards, updateFloorguards, type FloorguardData } from './entities/Floorguard';
import { Ninja } from './entities/Ninja';
import { LockedDoors, updateLockedDoors, type LockedDoorData } from './entities/LockedDoor';
import { LockedSwitchDefs, LockedSwitches, updateLockedSwitches, type LockedSwitchData } from './entities/LockedSwitch';
import { TrapSwitchDefs, TrapSwitches, updateTrapSwitches, type TrapSwitchData } from './entities/TrapSwitch';
import { TrapDoors, updateTrapDoors, type TrapDoorData } from './entities/TrapDoor';
import { RegularDoors, updateRegularDoors, type RegularDoorData } from './entities/RegularDoor';
import { ShoveThwumps, updateShoveThwumps, type ShoveThwumpData } from './entities/ShoveThwump';

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

    const [ninja, setNinja] = createSignal({ x: -50, y: -50, deg: 0 });
    const [ninjaPreview, setNinjaPreview] = createSignal({ x: -50, y: -50, deg: 0 });

    const [ninjaBones, setNinjaBones] = createSignal<Float32Array<ArrayBufferLike> | undefined>(undefined);
    const [ninjaPreviewBones, setNinjaPreviewBones] = createSignal<Float32Array<ArrayBufferLike> | undefined>(undefined);

    const mines = createSignal<MineData[]>([]);
    const bounceBlocks = createSignal<BounceBlockData[]>([]);
    const oneWays = createSignal<OneWayData[]>([]);
    const [boostPads, setBoostPads] = createSignal<BoostPad[]>([]);
    const [exitDoors, setExitDoors] = createSignal<ExitDoor[]>([]);
    const [exitSwitches, setExitSwitches] = createSignal<ExitSwitch[]>([]);
    const [thwumps, setThwumps] = createSignal<Thwump[]>([]);
    const launchPads = createSignal<LaunchPadData[]>([]);
    const floorguards = createSignal<FloorguardData[]>([]);
    const lockedDoors = createSignal<LockedDoorData[]>([]);
    const lockedSwitches = createSignal<LockedSwitchData[]>([]);
    const trapDoors = createSignal<TrapDoorData[]>([]);
    const trapSwitches = createSignal<TrapSwitchData[]>([]);
    const regularDoors = createSignal<RegularDoorData[]>([]);
    const shoveThwumps = createSignal<ShoveThwumpData[]>([]);

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
            deg: 0,
        });
        setNinjaPreview({
            x: replay.ninja_preview_x(partialFrame),
            y: replay.ninja_preview_y(partialFrame),
            deg: 0,
        });
        setNinjaBones(replay.ninja_bones(partialFrame));
        if (previewProgress() === undefined) {
            setNinjaPreviewBones(undefined);
        } else {
            setNinjaPreviewBones(replay.ninja_preview_bones(partialFrame));
        }

        updateMines(mines, replay);
        updateBounceBlocks(bounceBlocks, replay, partialFrame);
        updateOneWays(oneWays, replay);

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
        updateFloorguards(floorguards, replay, partialFrame);
        updateLockedDoors(lockedDoors, replay, partialFrame);
        updateLockedSwitches(lockedSwitches, replay);
        updateTrapDoors(trapDoors, replay, partialFrame);
        updateTrapSwitches(trapSwitches, replay);
        updateRegularDoors(regularDoors, replay, partialFrame);
        updateShoveThwumps(shoveThwumps, replay, partialFrame);

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
                    <BounceBlockDefs />
                    <OneWayDefs />
                    <LockedSwitchDefs />
                    <TrapSwitchDefs />
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
                <OneWays oneWays={oneWays} />
                <Mines mines={mines} />
                <LockedSwitches lockedSwitches={lockedSwitches} />
                <TrapSwitches trapSwitches={trapSwitches} />
                <Index each={exitSwitches()}>
                    {exitSwitch => <>
                        <path class="exit-switch" d={`M ${exitSwitch().x} ${exitSwitch().y} m ${-exitSwitchHalfWidth + exitSwitchCorner} ${-exitSwitchHalfHeight} h ${2 * (exitSwitchHalfWidth - exitSwitchCorner)} l ${exitSwitchCorner} ${exitSwitchCorner} v ${2 * (exitSwitchHalfHeight - exitSwitchCorner)} l ${-exitSwitchCorner} ${exitSwitchCorner} h ${2 * (-exitSwitchHalfWidth + exitSwitchCorner)} l ${-exitSwitchCorner} ${-exitSwitchCorner} v ${2 * (-exitSwitchHalfHeight + exitSwitchCorner)} l ${exitSwitchCorner} ${-exitSwitchCorner}`} />
                    </>}
                </Index>
                <LaunchPads launchPads={launchPads} />
                <Floorguards floorguards={floorguards} />
                <RegularDoors regularDoors={regularDoors} />
                <LockedDoors lockedDoors={lockedDoors} />
                <TrapDoors trapDoors={trapDoors} />
                <Index each={thwumps()}>
                    {thwump => <use href="#thwump" x={thwump().x} y={thwump().y} transform={`rotate(${thwump().deg},${thwump().x},${thwump().y})`} />}
                </Index>
                <BounceBlocks bounceBlocks={bounceBlocks} />
                <Index each={boostPads()}>
                    {boostPad => <use href="#boostpad" x={boostPad().x} y={boostPad().y} stroke={`color-mix(in srgb-linear, var(--boost-pad) ${boostPad().anim * 100}%, var(--boost-pad-wooshing))`} transform={`rotate(${boostPad().deg},${boostPad().x},${boostPad().y})`} />}
                </Index>
                <ShoveThwumps shoveThwumps={shoveThwumps} />
                <Ninja class="ninja preview" ninja={ninjaPreview} bones={ninjaPreviewBones} />
                <Ninja class="ninja" ninja={ninja} bones={ninjaBones} />
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
