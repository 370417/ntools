import { createSignal, Index, onCleanup, type Accessor } from 'solid-js';
import { Replay } from './assets/ntools_rs';
import { Scrubber } from './Scrubber';
// import Stats from 'stats-js';
import { LaunchPads, updateLaunchPads, type LaunchPadData } from './entities/LaunchPad';
import { MineDefs, Mines, updateMines, type MineData } from './entities/Mine';
import { OneWayDefs, OneWays, updateOneWays, type OneWayData } from './entities/OneWay';
import { BounceBlockDefs, BounceBlocks, updateBounceBlocks, type BounceBlockData } from './entities/BounceBlock';
import { FloorGuards, updateFloorGuards, type FloorGuardData } from './entities/FloorGuard';
import { Ninja } from './entities/Ninja';
import { LockedDoors, updateLockedDoors, type LockedDoorData } from './entities/LockedDoor';
import { LockedSwitchDefs, LockedSwitches, updateLockedSwitches, type LockedSwitchData } from './entities/LockedSwitch';
import { TrapSwitchDefs, TrapSwitches, updateTrapSwitches, type TrapSwitchData } from './entities/TrapSwitch';
import { TrapDoors, updateTrapDoors, type TrapDoorData } from './entities/TrapDoor';
import { RegularDoors, updateRegularDoors, type RegularDoorData } from './entities/RegularDoor';
import { ShoveThwumps, updateShoveThwumps, type ShoveThwumpData } from './entities/ShoveThwump';
import { ExitDoorGradient, ExitDoors, updateExitDoors, type ExitDoorData } from './entities/ExitDoor';
import { ExitSwitches, updateExitSwitches, type ExitSwitchData } from './entities/ExitSwitch';
import type { GlobalEventState } from './App';
import { BoostPadDefs, BoostPads, updateBoostPads, type BoostPadData } from './entities/BoostPad';
import { ThwumpDefs, Thwumps, updateThwumps, type ThwumpData } from './entities/Thwump';

export function ReplayApp(props: { replay: Replay, globalEventState: GlobalEventState }) {
    const replay = props.replay;

    const [recording, setRecording] = createSignal(true);
    const [isPlaying, setIsPlaying] = createSignal(true);
    // If dragging dragStart is the progress value (frame) that the drag started at.
    // If not dragging, dragStart is undefined.
    const [dragStart, setDragStart] = createSignal<number | undefined>(undefined);
    const [replayLength, setReplayLength] = createSignal(0);
    const [progress, setProgress] = createSignal(0);
    const [previewProgress, setPreviewProgress] = createSignal<number | undefined>(undefined);

    const keydownListener = (event: KeyboardEvent) => {
        if (event.code === 'Enter') {
            replay.place_ninja(props.globalEventState.mouseGamePos().x, props.globalEventState.mouseGamePos().y);
            if (!isPlaying()) {
                renderFrame(1);
            }
        }
    };

    document.addEventListener('keydown', keydownListener);

    onCleanup(() => {
        document.removeEventListener('keydown', keydownListener);
    });

    let stats: any = undefined;
    // stats = new Stats();
    stats?.showPanel(0);
    if (stats) document.body.appendChild(stats.dom);

    const tilePath = () => replay.tiles_path();

    const [ninja, setNinja] = createSignal({ x: -50, y: -50, deg: 0 });
    const [ninjaPreview, setNinjaPreview] = createSignal({ x: -50, y: -50, deg: 0 });

    const [ninjaBones, setNinjaBones] = createSignal<Float32Array<ArrayBufferLike>>();
    const [ninjaPreviewBones, setNinjaPreviewBones] = createSignal<Float32Array<ArrayBufferLike>>();

    const mines = createSignal<MineData[]>([]);
    const bounceBlocks = createSignal<BounceBlockData[]>([]);
    const oneWays = createSignal<OneWayData[]>([]);
    const boostPads = createSignal<BoostPadData[]>([]);
    const thwumps = createSignal<ThwumpData[]>([]);
    const launchPads = createSignal<LaunchPadData[]>([]);
    const floorGuards = createSignal<FloorGuardData[]>([]);
    const lockedDoors = createSignal<LockedDoorData[]>([]);
    const lockedSwitches = createSignal<LockedSwitchData[]>([]);
    const trapDoors = createSignal<TrapDoorData[]>([]);
    const trapSwitches = createSignal<TrapSwitchData[]>([]);
    const regularDoors = createSignal<RegularDoorData[]>([]);
    const shoveThwumps = createSignal<ShoveThwumpData[]>([]);
    const exitDoors = createSignal<ExitDoorData[]>([]);
    const exitSwitches = createSignal<ExitSwitchData[]>([]);

    let timeMs = performance.now();
    const fps = 60;
    const msPerTick = 1000 / fps;
    let accumulator = 0;
    let animFrameId = 0;
    function tick() {
        stats?.begin();
        const newTimeMs = performance.now();
        const frameTimeMs = Math.min(newTimeMs - timeMs, 250);
        timeMs = newTimeMs;

        let partialFrame = 1;

        const $replay = replay;

        if (isPlaying() && dragStart() === undefined) {
            if (recording() || progress() < replayLength()) {

                accumulator += frameTimeMs;

                while (accumulator >= msPerTick) {
                    if (recording()) {
                        let { isJump1Pressed, isJump2Pressed, isRightPressed, isLeftPressed, isSuicidePressed } = props.globalEventState;
                        $replay.set_input(isJump1Pressed() || isJump2Pressed(), isRightPressed(), isLeftPressed(), isSuicidePressed());
                    }
                    $replay.tick();
                    accumulator -= msPerTick;
                }
                partialFrame = accumulator / msPerTick;

                setProgress($replay.progress());
            } else if (progress() < replayLength()) {
                $replay.tick();
                setProgress($replay.progress());
            } else {
                setIsPlaying(false);
            }
            renderFrame(partialFrame);
        }
        stats?.end();
        animFrameId = requestAnimationFrame(tick);
    }
    tick();
    onCleanup(() => {
        cancelAnimationFrame(animFrameId);
    });

    function renderFrame(partialFrame: number) {
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
        updateBoostPads(boostPads, replay, partialFrame);
        updateThwumps(thwumps, replay, partialFrame);
        updateLaunchPads(launchPads, replay);
        updateFloorGuards(floorGuards, replay, partialFrame);
        updateLockedDoors(lockedDoors, replay, partialFrame);
        updateLockedSwitches(lockedSwitches, replay);
        updateTrapDoors(trapDoors, replay, partialFrame);
        updateTrapSwitches(trapSwitches, replay);
        updateRegularDoors(regularDoors, replay, partialFrame);
        updateShoveThwumps(shoveThwumps, replay, partialFrame);
        updateExitDoors(exitDoors, replay, partialFrame);
        updateExitSwitches(exitSwitches, replay, partialFrame);

        setReplayLength(replay.replay_length());
    }

    return (
        <>
            <svg viewBox="0 0 1056 600" onmousemove={function(this: SVGElement, event) {
                const { left, top, width, height } = this.getBoundingClientRect();
                props.globalEventState.setMouseGamePos({
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
                    <BoostPadDefs />
                    <ThwumpDefs />
                    <ExitDoorGradient />
                </defs>
                <ExitDoors exitDoors={exitDoors} />
                <OneWays oneWays={oneWays} />
                <Mines mines={mines} />
                <LockedSwitches lockedSwitches={lockedSwitches} />
                <TrapSwitches trapSwitches={trapSwitches} />
                <ExitSwitches exitSwitches={exitSwitches} />
                <LaunchPads launchPads={launchPads} />
                <FloorGuards floorGuards={floorGuards} />
                <RegularDoors regularDoors={regularDoors} />
                <LockedDoors lockedDoors={lockedDoors} />
                <TrapDoors trapDoors={trapDoors} />
                <Thwumps thwumps={thwumps} />
                <BounceBlocks bounceBlocks={bounceBlocks} />
                <BoostPads boostPads={boostPads} />
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
                        replay.seek(frame);
                        renderFrame(1);
                    }}
                    previewSeek={frame => {
                        setPreviewProgress(frame);
                        if (replay) {
                            if (frame !== undefined && dragStart() === undefined) {
                                replay.seek_preview(frame);
                            }
                            renderFrame(1);
                        }
                    }}
                />
            </div>
        </>
    )
}
