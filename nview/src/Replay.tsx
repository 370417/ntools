import { createSignal, onCleanup, Show } from 'solid-js';
import { Editor, Replay } from './assets/ntools_rs';
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
import { updateZapDrones, ZapDroneDefs, ZapDrones, type ZapDroneData } from './entities/ZapDrone';
import { ChaingunDroneDefs, ChaingunDrones, updateChaingunDrones, type ChaingunDroneData } from './entities/ChaingunDrone';
import { ChaseDroneDefs, ChaseDrones, updateChaseDrones, type ChaseDroneData } from './entities/ChaseDrone';
import { LaserDroneDefs, LaserDrones, updateLaserDrones, type LaserDroneData } from './entities/LaserDrone';
import { GoldDefs, Golds, updateGolds, type GoldData } from './entities/Gold';

export function ReplayApp(props: { replay: Replay, editor: Editor, globalEventState: GlobalEventState }) {
    const replay = props.replay;

    const [recording, setRecording] = createSignal(true);
    const [isPlaying, setIsPlaying] = createSignal(true);
    // If dragging dragStart is the progress value (frame) that the drag started at.
    // If not dragging, dragStart is undefined.
    const [dragStart, setDragStart] = createSignal<number | undefined>(undefined);
    const [replayLength, setReplayLength] = createSignal(0);
    const [progress, setProgress] = createSignal(0);
    const [previewProgress, setPreviewProgress] = createSignal<number | undefined>(undefined);
    const [score, setScore] = createSignal(90 * 60);

    const keydownListener = (event: KeyboardEvent) => {
        if (event.code === 'Enter') {
            replay.place_ninja(props.globalEventState.mouseGamePos().x, props.globalEventState.mouseGamePos().y);
            if (!isPlaying()) {
                renderFrame(1);
            }
        } else if (event.code === 'Escape') {
            if (isPlaying()) {
                setIsPlaying(false);
                setRecording(false);
            } else {
                setIsPlaying(true);
                setRecording(true);
            }
        } else if (event.code === 'Comma') {
            if (!isPlaying() && progress() > 0) {
                setProgress(progress() - 1);
                replay.seek(progress());
                replay.seek_preview(replay.progress() + 120);
                setPreviewProgress(replay.progress_preview());
                updatePastNinjas();
                renderFrame(1);
            }
        } else if (event.code === 'Period') {
            if (!isPlaying()) {
                let { isJump1Pressed, isJump2Pressed, isRightPressed, isLeftPressed, isSuicidePressed } = props.globalEventState;
                replay.set_input(isJump1Pressed() || isJump2Pressed(), isRightPressed(), isLeftPressed(), isSuicidePressed());
                replay.tick();
                setProgress(replay.progress());
                replay.seek_preview(replay.progress() + 120);
                setPreviewProgress(replay.progress_preview());
                updatePastNinjas();
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

    const [ninjaBones, setNinjaBones] = createSignal<Float64Array<ArrayBufferLike>>();
    const [ninjaPreviewBones, setNinjaPreviewBones] = createSignal<Float64Array<ArrayBufferLike>>();

    const mines = createSignal<MineData[]>([]);
    const golds = createSignal<GoldData[]>([]);
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
    const zapDrones = createSignal<ZapDroneData[]>([]);
    const chaseDrones = createSignal<ChaseDroneData[]>([]);
    const chaingunDrones = createSignal<ChaingunDroneData[]>([]);
    const laserDrones = createSignal<LaserDroneData[]>([]);

    const [pastNinjas, setPastNinjas] = createSignal<{ x: number, y: number }[]>([]);
    function updatePastNinjas() {
        const pastNinjas: { x: number, y: number }[] = [];
        const len = replay.past_ninjas_len();
        for (let i = 0; i < len; i++) {
            pastNinjas.push({
                x: replay.past_ninja_x(i),
                y: replay.past_ninja_y(i),
            });
        }
        setPastNinjas(pastNinjas);
    }

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
        setScore(replay.score());
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
        updateGolds(golds, replay);
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
        updateZapDrones(zapDrones, replay, partialFrame);
        updateChaseDrones(chaseDrones, replay, partialFrame);
        updateChaingunDrones(chaingunDrones, replay, partialFrame);
        updateLaserDrones(laserDrones, replay, partialFrame);

        setReplayLength(replay.replay_length());
    }

    return (
        <>
            <span style={{
                position: 'absolute',
            }} >{(score() / 60).toFixed(3)}</span>
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
                    <GoldDefs />
                    <BounceBlockDefs />
                    <OneWayDefs />
                    <LockedSwitchDefs />
                    <TrapSwitchDefs />
                    <BoostPadDefs />
                    <ThwumpDefs />
                    <ChaingunDroneDefs />
                    <LaserDroneDefs />
                    <ZapDroneDefs />
                    <ChaseDroneDefs />
                    <ExitDoorGradient />
                </defs>
                <ExitDoors exitDoors={exitDoors[0]} />
                <OneWays oneWays={oneWays[0]} />
                <Mines mines={mines[0]} />
                <RegularDoors regularDoors={regularDoors[0]} />
                <LockedDoors lockedDoors={lockedDoors[0]} />
                <TrapDoors trapDoors={trapDoors[0]} />
                <LockedSwitches lockedSwitches={lockedSwitches[0]} />
                <TrapSwitches trapSwitches={trapSwitches[0]} />
                <Golds golds={golds[0]} />
                <ExitSwitches exitSwitches={exitSwitches[0]} />
                <LaunchPads launchPads={launchPads[0]} />
                <ChaingunDrones chaingunDrones={chaingunDrones[0]} />
                <LaserDrones laserDrones={laserDrones[0]} />
                <ZapDrones zapDrones={zapDrones[0]} />
                <ChaseDrones chaseDrones={chaseDrones[0]} />
                <FloorGuards floorGuards={floorGuards[0]} />
                <Thwumps thwumps={thwumps[0]} />
                <Ninja class="ninja preview" ninja={ninjaPreview} bones={ninjaPreviewBones} />
                <Ninja class="ninja" ninja={ninja} bones={ninjaBones} />
                <BounceBlocks bounceBlocks={bounceBlocks[0]} />
                <ShoveThwumps shoveThwumps={shoveThwumps[0]} />
                <BoostPads boostPads={boostPads[0]} />
                <path id="tiles" stroke-width="2" clip-path="url(#tiles-clip)" clip-rule="evenodd" d={tilePath()} fill-rule="evenodd" />
                <Show when={!isPlaying()}>
                    <polyline stroke="var(--ninja)" fill="none" points={pastNinjas().slice(progress(), previewProgress() || 0).map(({ x, y }) => `${x},${y}`).join(' ')} />
                </Show>
            </svg>
            <div>
                <Show when={!recording() || !isPlaying()}>
                    <Scrubber
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
                            updatePastNinjas();
                            if (replay) {
                                if (frame !== undefined && dragStart() === undefined) {
                                    replay.seek_preview(frame);
                                }
                                renderFrame(1);
                            }
                        }}
                        attract={() => replay.export_attract(props.editor)}
                    />
                </Show>
            </div>
        </>
    )
}
