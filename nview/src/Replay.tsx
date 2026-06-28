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
import { InputDisplay } from './InputDisplay';
import { DeathballDefs, Deathballs, updateDeathballs, type DeathballData } from './entities/Deathball';
import { EvilNinjaDefs, EvilNinjas, updateEvilNinjas, type EvilNinjaData } from './entities/EvilNinja';
import { getPortals, PortalDefs, Portals, type PortalData } from './entities/Portal';
import { type RocketTurretData, RocketTurretDefs, RocketTurrets, updateRocketTurrets } from './entities/RocketTurret';
import { type RocketData, RocketDefs, Rockets, updateRockets } from './entities/Rocket';
import { Gauss, GaussDefs, updateGauss, type GaussData } from './entities/GaussTurret';
import { GaussReticleDefs, GaussReticles, updateGaussReticles, type GaussReticleData } from './entities/GaussReticle';

const xhairHalfSize = 4;
const crosshairPath = `M ${-xhairHalfSize} 0 H ${xhairHalfSize} M 0 ${-xhairHalfSize} V ${xhairHalfSize}`;

export function ReplayApp(props: { replay: Replay, editor: Editor, globalEventState: GlobalEventState }) {
    const replay = props.replay;

    const [recording, setRecording] = createSignal(true);
    const [isPlaying, setIsPlaying] = createSignal(!replay.is_from_attract());
    // If dragging dragStart is the progress value (frame) that the drag started at.
    // If not dragging, dragStart is undefined.
    const [dragStart, setDragStart] = createSignal<number>();
    const [replayLength, setReplayLength] = createSignal(0);
    const [progress, setProgress] = createSignal(0);
    const [previewProgress, setPreviewProgress] = createSignal<number>();
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
                setPreviewProgress(undefined);
                updatePausedInfo();
                props.editor.set_start_replay_paused(true);
            } else {
                setIsPlaying(true);
                setRecording(true);
                props.editor.set_start_replay_paused(false);
            }
        } else if (event.code === 'Comma') {
            if (!isPlaying() && progress() > 0) {
                setProgress(progress() - 1);
                replay.seek(progress());

                let { isJump1Pressed, isJump2Pressed, isRightPressed, isLeftPressed, isDownPressed, isSuicidePressed } = props.globalEventState;
                if (isJump1Pressed() || isJump2Pressed() || isRightPressed() || isLeftPressed() || isSuicidePressed()) {
                    replay.set_input(isJump1Pressed() || isJump2Pressed(), isRightPressed(), isLeftPressed(), isSuicidePressed());
                } else if (isDownPressed()) {
                    // set neutral input if down is pressed
                    replay.set_input(false, false, false, false);
                } else {
                    // don't change existing input if nothing is pressed
                }

                updatePausedInfo();
                renderFrame(1);
            }
        } else if (event.code === 'Period') {
            if (!isPlaying()) {
                let { isJump1Pressed, isJump2Pressed, isRightPressed, isLeftPressed, isDownPressed, isSuicidePressed } = props.globalEventState;
                if (isJump1Pressed() || isJump2Pressed() || isRightPressed() || isLeftPressed() || isSuicidePressed()) {
                    replay.set_input(isJump1Pressed() || isJump2Pressed(), isRightPressed(), isLeftPressed(), isSuicidePressed());
                } else if (isDownPressed() || replay.inputs_len() === replay.progress()) {
                    // set neutral input if down is pressed or if there is no existing input
                    replay.set_input(false, false, false, false);
                } else {
                    // don't change existing input if nothing is pressed
                }
                replay.tick();
                setProgress(replay.progress());
                updatePausedInfo();
                renderFrame(1);
            }
        }
    };

    function updatePausedInfo() {
        replay.seek_preview(replay.progress() + 120);
        setPreviewProgress(replay.progress_preview());
        updateInputs();
        updatePastNinjaBones();
        updatePastNinjas();
        setNinjaInfo(replay.ninja_info());
    }

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
    const [portalNinja, setPortalNinja] = createSignal({ x: -50, y: -50, deg: 0 });

    const [ninjaBones, setNinjaBones] = createSignal<Float64Array<ArrayBufferLike>>();
    const [ninjaPreviewBones, setNinjaPreviewBones] = createSignal<Float64Array<ArrayBufferLike>>();
    const [portalNinjaBones, setPortalNinjaBones] = createSignal<Float64Array<ArrayBufferLike>>();

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
    const deathballs = createSignal<DeathballData[]>([]);
    const evilNinjas = createSignal<EvilNinjaData[]>([]);
    const rocketTurrets = createSignal<RocketTurretData[]>([]);
    const rockets = createSignal<RocketData[]>([]);
    const gauss = createSignal<GaussData[]>([]);
    const gaussReticles = createSignal<GaussReticleData[]>([]);
    const portals = createSignal<PortalData[]>([]);
    getPortals(portals, replay);

    const [ninjaInfo, setNinjaInfo] = createSignal('');
    const [distanceMeasurePoint, setDistanceMeasurePoint] = createSignal<{ x: number, y: number }>();

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
    updatePastNinjas();

    // 42 inputs, 21 before current sim and 21 after
    const [inputs, setInputs] = createSignal<number[]>([]);
    function updateInputs() {
        const inputs = [];
        for (let i = -21; i < 21; i++) {
            const frame = i + replay.progress();
            if (frame < 0 || frame >= replay.inputs_len()) {
                inputs.push(NaN);
            } else {
                inputs.push(replay.input(frame));
            }
        }
        setInputs(inputs);
    }
    updateInputs();

    // 41 elements, 20 before current sim, 1 at current sim, 20 after
    const [pastNinjaBones, setPastNinjaBones] = createSignal<Float64Array<ArrayBufferLike>[]>([]);
    function updatePastNinjaBones() {
        const bones = [];
        for (let i = -20; i <= 20; i++) {
            const frame = i + replay.progress();
            bones.push(replay.past_ninja_bones(frame));
        }
        setPastNinjaBones(bones);
    }
    updatePastNinjaBones();

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
                    updateInputs();
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
        setPortalNinja({
            x: replay.portal_ninja_x(partialFrame),
            y: replay.portal_ninja_y(partialFrame),
            deg: 0,
        });
        setNinjaBones(replay.ninja_bones(partialFrame));
        if (previewProgress() === undefined) {
            setNinjaPreviewBones(undefined);
        } else {
            setNinjaPreviewBones(replay.ninja_preview_bones(partialFrame));
        }
        setPortalNinjaBones(replay.portal_ninja_bones());

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
        updateDeathballs(deathballs, replay, partialFrame);
        updateRocketTurrets(rocketTurrets, replay);
        updateRockets(rockets, replay, partialFrame);
        updateGauss(gauss, replay);
        updateGaussReticles(gaussReticles, replay);
        updateEvilNinjas(evilNinjas, replay, partialFrame);

        setReplayLength(replay.replay_length());
    }

    renderFrame(1);

    return (
        <>
            <span style={{
                position: 'absolute',
            }} >{(score() / 60).toFixed(3)}</span>
            <Show when={!isPlaying()}>
                <span style={{
                    position: 'absolute',
                    top: '1.5em',
                    'white-space': 'pre',
                    'font-family': 'monospace',
                }}>
                    {ninjaInfo()}
                </span>
            </Show>
            <svg viewBox="0 0 1056 600" onmousemove={function(this: SVGElement, event) {
                const { left, top, width, height } = this.getBoundingClientRect();
                props.globalEventState.setMouseGamePos({
                    x: (event.clientX - left) / width * 1056,
                    y: (event.clientY - top) / height * 600,
                });
            }}
            onmousedown={function() {
                const { x, y } = props.globalEventState.mouseGamePos();
                const roundedX = Math.round(x / 6) * 6;
                const roundedY = Math.round(y / 6) * 6;
                const point = distanceMeasurePoint();
                if (roundedX === point?.x && roundedY === point?.y) {
                    setDistanceMeasurePoint(undefined);
                } else {
                    setDistanceMeasurePoint({ x: roundedX, y: roundedY });
                }
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
                    <DeathballDefs />
                    <ExitDoorGradient />
                    <EvilNinjaDefs />
                    <RocketTurretDefs />
                    <RocketDefs />
                    <GaussDefs />
                    <GaussReticleDefs />
                    <PortalDefs />
                    <path id="crosshair" stroke-width="1.5" fill="none" d={crosshairPath} />
                </defs>
                <Portals portals={portals[0]} showMode={false} />
                <TrapDoors trapDoors={trapDoors[0]} />
                <LockedDoors lockedDoors={lockedDoors[0]} />
                <LockedSwitches lockedSwitches={lockedSwitches[0]} />
                <TrapSwitches trapSwitches={trapSwitches[0]} />
                <ExitDoors exitDoors={exitDoors[0]} />
                <OneWays oneWays={oneWays[0]} />
                <Mines mines={mines[0]} />
                <Golds golds={golds[0]} />
                <ExitSwitches exitSwitches={exitSwitches[0]} />
                <RegularDoors regularDoors={regularDoors[0]} />
                <LaunchPads launchPads={launchPads[0]} />
                <LaserDrones laserDrones={laserDrones[0]} />
                <ChaingunDrones chaingunDrones={chaingunDrones[0]} />
                <ZapDrones zapDrones={zapDrones[0]} />
                <ChaseDrones chaseDrones={chaseDrones[0]} />
                <FloorGuards floorGuards={floorGuards[0]} />
                <Deathballs deathballs={deathballs[0]} />
                <RocketTurrets rocketTurrets={rocketTurrets[0]} />
                <Gauss gaussTurrets={gauss[0]} />
                <GaussReticles gauss={gaussReticles[0]} />
                <Rockets rockets={rockets[0]} />
                <Thwumps thwumps={thwumps[0]} />
                <EvilNinjas evilNinjas={evilNinjas[0]} />
                <Ninja class="ninja preview" ninja={ninjaPreview} bones={ninjaPreviewBones} />
                <BounceBlocks bounceBlocks={bounceBlocks[0]} />
                <ShoveThwumps shoveThwumps={shoveThwumps[0]} />
                <BoostPads boostPads={boostPads[0]} />
                <Show when={Number.isFinite(portalNinja().x)}>
                    <Ninja class="ninja" ninja={portalNinja} bones={portalNinjaBones} />
                </Show>
                <Ninja class="ninja" ninja={ninja} bones={ninjaBones} />
                <path id="tiles" stroke-width="2" clip-path="url(#tiles-clip)" clip-rule="evenodd" d={tilePath()} fill-rule="evenodd" />
                <Show when={!isPlaying()}>
                    <polyline stroke="var(--ninja)" fill="none" points={pastNinjas().slice(progress(), previewProgress() || 0).map(({ x, y }) => `${x},${y}`).join(' ')} />
                    <InputDisplay inputs={inputs} pastNinjas={pastNinjaBones} />
                    <Show when={distanceMeasurePoint()}>
                        <use href="#crosshair" x={distanceMeasurePoint()!.x} y={distanceMeasurePoint()!.y} />
                        <text x={distanceMeasurePoint()!.x} y={distanceMeasurePoint()!.y}>x {distanceMeasurePoint()!.x - ninja().x}</text>
                        <text x={distanceMeasurePoint()!.x} y={distanceMeasurePoint()!.y + 20}>y {distanceMeasurePoint()!.y - ninja().y}</text>
                        <text x={distanceMeasurePoint()!.x} y={distanceMeasurePoint()!.y + 40}>{(() => {
                            let x = distanceMeasurePoint()!.x - ninja().x;
                            let y = distanceMeasurePoint()!.y - ninja().y;
                            return Math.sqrt(x * x + y * y);
                        })()}</text>
                    </Show>
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
                            updateInputs();
                            updatePastNinjaBones();
                            updatePastNinjas();
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
