import { createSignal, For, onCleanup, Show, type Accessor, type Setter } from "solid-js";
import { Editor, ExportedEntity, Replay } from "./assets/ntools_rs";
import { Ninja, type NinjaData } from "./entities/Ninja";
import { ExitDoors, type ExitDoorData } from "./entities/ExitDoor";
import { ExitSwitches, type ExitSwitchData } from "./entities/ExitSwitch";
import { OneWayDefs, OneWays, type OneWayData } from "./entities/OneWay";
import { MINE_TOGGLED, MINE_UNTOGGLED, MineDefs, Mines, type MineData } from "./entities/Mine";
import { RegularDoors, type RegularDoorData } from "./entities/RegularDoor";
import { LockedDoors, type LockedDoorData } from "./entities/LockedDoor";
import { LockedSwitchDefs, LockedSwitches, type LockedSwitchData } from "./entities/LockedSwitch";
import { TrapDoors, type TrapDoorData } from "./entities/TrapDoor";
import { TrapSwitchDefs, TrapSwitches, type TrapSwitchData } from "./entities/TrapSwitch";
import { LaunchPads, type LaunchPadData } from "./entities/LaunchPad";
import { FloorGuards, type FloorGuardData } from "./entities/FloorGuard";
import { BounceBlockDefs, BounceBlocks, type BounceBlockData } from "./entities/BounceBlock";
import type { GlobalEventState } from "./App";
import { BoostPadDefs, BoostPads, type BoostPadData } from "./entities/BoostPad";
import { ThwumpDefs, Thwumps, type ThwumpData } from "./entities/Thwump";
import { ShoveThwumps, type ShoveThwumpData } from "./entities/ShoveThwump";
import { EditorFooter } from "./EditorFooter";
import { debouncedSaveMap } from "./localstorage";
import type { Palette } from "./palette";
import { ModeIndicator, ZapDroneDefs, ZapDrones, type ZapDroneData } from "./entities/ZapDrone";
import { ChaingunDroneDefs, ChaingunDrones, type ChaingunDroneData } from "./entities/ChaingunDrone";
import { BatDefs, Bats, type BatData } from "./entities/Bat";
import { LaserDroneDefs, LaserDrones, type LaserDroneData } from "./entities/LaserDrone";
import { ChaseDroneDefs, ChaseDrones, type ChaseDroneData } from "./entities/ChaseDrone";
import { GoldDefs, Golds, type GoldData } from "./entities/Gold";
import { DeathballDefs, Deathballs, type DeathballData } from "./entities/Deathball";
import { EVIL_NINJA_UNTOUCHED, EvilNinjaDefs, EvilNinjas, type EvilNinjaData } from "./entities/EvilNinja";

const COLS = 42;
const ROWS = 23;

// Crosshairs
// distance from center of tile to outer edge of crosshair
const tcOuter = 13.5;
// distance from center of tile to inner endpoint of crosshair
const tcInner = 9;
const tilemodeCrosshairPath = `M ${-tcOuter} ${-tcInner} V ${-tcOuter} H ${-tcInner} M ${tcInner} ${-tcOuter} H ${tcOuter} V ${-tcInner} M ${tcOuter} ${tcInner} V ${tcOuter} H ${tcInner} M ${-tcInner} ${tcOuter} H ${-tcOuter} V ${tcInner}`;
const xhairHalfSize = 4;
const crosshairPath = `M ${-xhairHalfSize} 0 H ${xhairHalfSize} M 0 ${-xhairHalfSize} V ${xhairHalfSize}`;

const MODE_PAINT_TILES = 0;
const MODE_TILE_PALETTE = 1;
// const MODE_SELECT_TILES = 2;
const MODE_MOVE_SELECTION = 3;
const MODE_PLACE_ENTITY = 4;
const MODE_SELECT_ENTITY = 5;
const MODE_MODIFY_ENTITY = 6;
const MODE_ENTITY_PALETTE = 7;
const MODE_PEN_TOOL = 8;
const MODE_SPAWN_NINJA = 9;

const ENTITY_NINJA = 0;
const ENTITY_MINE = 1;
const ENTITY_GOLD = 2;
const ENTITY_EXIT = 3;
const ENTITY_REGULAR_DOOR = 5;
const ENTITY_LOCKED_DOOR = 6;
const ENTITY_TRAP_DOOR = 8;
const ENTITY_LAUNCH_PAD = 10;
const ENTITY_ONE_WAY = 11;
const ENTITY_CHAINGUN_DRONE = 12;
const ENTITY_LASER_DRONE = 13;
const ENTITY_ZAP_DRONE = 14;
const ENTITY_CHASE_DRONE = 15;
const ENTITY_FLOOR_GUARD = 16;
const ENTITY_BOUNCE_BLOCK = 17;
const ENTITY_THWUMP = 20;
const ENTITY_EVIL_NINJA = 22;
const ENTITY_TOGGLE_MINE = 21;
const ENTITY_BOOST_PAD = 24;
const ENTITY_DEATHBALL = 25;
const ENTITY_BAT = 27;
const ENTITY_SHOVE_THWUMP = 28;

const BONES_STANDING = new Float64Array([-0.039, -0.0249, 0.1127, -0.1738, 0.1115, -0.1512, -0.0846, 0.0749, 0.1072, -0.0423, 0.0263, -0.1452, -0.0358, -0.075, -0.377, 0.4686, 0.4643, -0.0225, -0.0453, -0.5054, -0.4724, 0.1962, 0.2293, -0.1812, -0.2266, -0.2224]);
const BONES_FALLING = new Float64Array([0.018, 0.0, 0.4156, 0.0988, 0.3581, -0.3242, -0.0708, 0.0845, 0.2924, 0.3212, 0.1853, -0.1927, -0.0236, -0.06, -0.3602, 0.3086, 0.1278, -0.3238, -0.2018, -0.4976, -0.4488, 0.0656, -0.024, -0.2729, -0.3268, -0.2042]);

const ENTITY_PALETTE_SIZE = 150;
const ENTITY_PALETTE_RETICLE_RADIUS = 16;

const TILE_PALETTE_PATH = "M -13 -13 V -62 H 13 V -13 H 62 V 13 H 13 V 62 H -13 V 13 H -62 V -13 H -13 M -12 -12 H 12 V 12 H -12 V -12";

type Line = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

type StackCounts = Array<{
    x: number;
    y: number;
    count: number;
}>;

function updateStackCounts(setStackCounts: Setter<StackCounts>, entities: ExportedEntity[]) {
    const stackCounts = entities.map(entity => ({
        x: entity.x,
        y: entity.y,
        count: entity.stack_count,
    })).filter(({ count }) => count > 1);
    setStackCounts(stackCounts);
}

export type EntitiesProps = {
    ninjas: Accessor<NinjaData[]>,
    setNinjas: Setter<NinjaData[]>,
    mines: Accessor<MineData[]>,
    setMines: Setter<MineData[]>,
    golds: Accessor<GoldData[]>,
    setGolds: Setter<GoldData[]>,
    exitDoors: Accessor<ExitDoorData[]>,
    setExitDoors: Setter<ExitDoorData[]>,
    exitSwitches: Accessor<ExitSwitchData[]>,
    setExitSwitches: Setter<ExitSwitchData[]>,
    regularDoors: Accessor<RegularDoorData[]>,
    setRegularDoors: Setter<RegularDoorData[]>,
    lockedDoors: Accessor<LockedDoorData[]>,
    setLockedDoors: Setter<LockedDoorData[]>,
    lockedSwitches: Accessor<LockedSwitchData[]>,
    setLockedSwitches: Setter<LockedSwitchData[]>,
    trapDoors: Accessor<TrapDoorData[]>,
    setTrapDoors: Setter<TrapDoorData[]>,
    trapSwitches: Accessor<TrapSwitchData[]>,
    setTrapSwitches: Setter<TrapSwitchData[]>,
    launchPads: Accessor<LaunchPadData[]>,
    setLaunchPads: Setter<LaunchPadData[]>,
    oneWays: Accessor<OneWayData[]>,
    setOneWays: Setter<OneWayData[]>,
    chaingunDrones: Accessor<ChaingunDroneData[]>,
    setChaingunDrones: Setter<ChaingunDroneData[]>,
    laserDrones: Accessor<LaserDroneData[]>,
    setLaserDrones: Setter<LaserDroneData[]>,
    zapDrones: Accessor<ZapDroneData[]>,
    setZapDrones: Setter<ZapDroneData[]>,
    chaseDrones: Accessor<ChaseDroneData[]>,
    setChaseDrones: Setter<ChaseDroneData[]>,
    floorGuards: Accessor<FloorGuardData[]>,
    setFloorGuards: Setter<FloorGuardData[]>,
    bounceBlocks: Accessor<BounceBlockData[]>,
    setBounceBlocks: Setter<BounceBlockData[]>,
    thwumps: Accessor<ThwumpData[]>,
    setThwumps: Setter<ThwumpData[]>,
    evilNinjas: Accessor<EvilNinjaData[]>,
    setEvilNinjas: Setter<EvilNinjaData[]>,
    boostPads: Accessor<BoostPadData[]>,
    setBoostPads: Setter<BoostPadData[]>,
    deathballs: Accessor<DeathballData[]>,
    setDeathballs: Setter<DeathballData[]>,
    bats: Accessor<BatData[]>,
    setBats: Setter<BatData[]>,
    shoveThwumps: Accessor<ShoveThwumpData[]>,
    setShoveThwumps: Setter<ShoveThwumpData[]>,
};

function createEntities(): EntitiesProps {
    const [ninjas, setNinjas] = createSignal<NinjaData[]>([]);
    const [mines, setMines] = createSignal<MineData[]>([]);
    const [golds, setGolds] = createSignal<GoldData[]>([]);
    const [exitDoors, setExitDoors] = createSignal<ExitDoorData[]>([]);
    const [exitSwitches, setExitSwitches] = createSignal<ExitSwitchData[]>([]);
    const [regularDoors, setRegularDoors] = createSignal<RegularDoorData[]>([]);
    const [lockedDoors, setLockedDoors] = createSignal<LockedDoorData[]>([]);
    const [lockedSwitches, setLockedSwitches] = createSignal<LockedSwitchData[]>([]);
    const [trapDoors, setTrapDoors] = createSignal<TrapDoorData[]>([]);
    const [trapSwitches, setTrapSwitches] = createSignal<TrapSwitchData[]>([]);
    const [launchPads, setLaunchPads] = createSignal<LaunchPadData[]>([]);
    const [oneWays, setOneWays] = createSignal<OneWayData[]>([]);
    const [chaingunDrones, setChaingunDrones] = createSignal<ChaingunDroneData[]>([]);
    const [laserDrones, setLaserDrones] = createSignal<LaserDroneData[]>([]);
    const [zapDrones, setZapDrones] = createSignal<ZapDroneData[]>([]);
    const [chaseDrones, setChaseDrones] = createSignal<ChaseDroneData[]>([]);
    const [floorGuards, setFloorGuards] = createSignal<FloorGuardData[]>([]);
    const [bounceBlocks, setBounceBlocks] = createSignal<BounceBlockData[]>([]);
    const [thwumps, setThwumps] = createSignal<ThwumpData[]>([]);
    const [evilNinjas, setEvilNinjas] = createSignal<EvilNinjaData[]>([]);
    const [boostPads, setBoostPads] = createSignal<BoostPadData[]>([]);
    const [deathballs, setDeathballs] = createSignal<DeathballData[]>([]);
    const [bats, setBats] = createSignal<BatData[]>([]);
    const [shoveThwumps, setShoveThwumps] = createSignal<ShoveThwumpData[]>([]);
    return {
        ninjas, setNinjas,
        mines, setMines,
        golds, setGolds,
        exitDoors, setExitDoors,
        exitSwitches, setExitSwitches,
        regularDoors, setRegularDoors,
        lockedDoors, setLockedDoors,
        lockedSwitches, setLockedSwitches,
        trapDoors, setTrapDoors,
        trapSwitches, setTrapSwitches,
        launchPads, setLaunchPads,
        oneWays, setOneWays,
        chaingunDrones, setChaingunDrones,
        laserDrones, setLaserDrones,
        zapDrones, setZapDrones,
        chaseDrones, setChaseDrones,
        floorGuards, setFloorGuards,
        bounceBlocks, setBounceBlocks,
        thwumps, setThwumps,
        evilNinjas, setEvilNinjas,
        boostPads, setBoostPads,
        deathballs, setDeathballs,
        bats, setBats,
        shoveThwumps, setShoveThwumps,
    };
}

function updateEntities(entities: EntitiesProps, lines: Line[], exportedEntities: ExportedEntity[], isPreview: boolean) {
    const ninjas: NinjaData[] = [];
    const mines: MineData[] = [];
    const golds: GoldData[] = [];
    const exitDoors: ExitDoorData[] = [];
    const exitSwitches: ExitSwitchData[] = [];
    const regularDoors: RegularDoorData[] = [];
    const lockedDoors: LockedDoorData[] = [];
    const lockedSwitches: LockedSwitchData[] = [];
    const trapDoors: TrapDoorData[] = [];
    const trapSwitches: TrapSwitchData[] = [];
    const launchPads: LaunchPadData[] = [];
    const oneWays: OneWayData[] = [];
    const chaingunDrones: ChaingunDroneData[] = [];
    const laserDrones: LaserDroneData[] = [];
    const zapDrones: ZapDroneData[] = [];
    const chaseDrones: ChaseDroneData[] = [];
    const floorGuards: FloorGuardData[] = [];
    const bounceBlocks: BounceBlockData[] = [];
    const thwumps: ThwumpData[] = [];
    const evilNinjas: EvilNinjaData[] = [];
    const boostPads: BoostPadData[] = [];
    const deathballs: DeathballData[] = [];
    const bats: BatData[] = [];
    const shoveThwumps: ShoveThwumpData[] = [];

    for (const entity of exportedEntities) {
        // Make sure to create new objects instead of reusing entity
        // because it is an object that comes from wasm.
        const entityCopy = {
            x: entity.x,
            y: entity.y,
            deg: entity.deg,
            mode: entity.mode,
            animProgress: 0,
        };
        const entitySwitch = {
            x: entity.switch_x,
            y: entity.switch_y,
            animProgress: 0,
            wasTouched: false,
        };
        const line = {
            x1: entity.x,
            y1: entity.y,
            x2: entity.switch_x,
            y2: entity.switch_y,
        };
        if (entity.type_int === ENTITY_NINJA) {
            ninjas.push(entityCopy);
        } else if (entity.type_int === ENTITY_MINE) {
            mines.push({
                ...entityCopy,
                type: MINE_TOGGLED,
            });
        } else if (entity.type_int === ENTITY_TOGGLE_MINE) {
            mines.push({
                ...entityCopy,
                type: MINE_UNTOGGLED,
            });
        } else if (entity.type_int === ENTITY_GOLD) {
            golds.push({
                ...entityCopy,
                collected: false,
            });
        } else if (entity.type_int === ENTITY_EXIT) {
            exitDoors.push(entityCopy);
            if (!Number.isNaN(entity.switch_x)) {
                exitSwitches.push(entitySwitch);
                lines.push(line);
            }
        } else if (entity.type_int === ENTITY_REGULAR_DOOR) {
            regularDoors.push(entityCopy);
        } else if (entity.type_int === ENTITY_LOCKED_DOOR) {
            lockedDoors.push(entityCopy);
            if (!Number.isNaN(entity.switch_x)) {
                lockedSwitches.push(entitySwitch);
                lines.push(line);
            }
        } else if (entity.type_int === ENTITY_TRAP_DOOR) {
            trapDoors.push({
                ...entityCopy,
                animProgress: isPreview ? 1 : -1,
            });
            if (!Number.isNaN(entity.switch_x)) {
                trapSwitches.push(entitySwitch);
                lines.push(line);
            }
        } else if (entity.type_int === ENTITY_LAUNCH_PAD) {
            launchPads.push(entityCopy);
        } else if (entity.type_int === ENTITY_ONE_WAY) {
            oneWays.push(entityCopy);
        } else if (entity.type_int === ENTITY_CHAINGUN_DRONE) {
            chaingunDrones.push(entityCopy);
        } else if (entity.type_int === ENTITY_LASER_DRONE) {
            laserDrones.push(entityCopy);
        } else if (entity.type_int === ENTITY_ZAP_DRONE) {
            zapDrones.push(entityCopy);
        } else if (entity.type_int === ENTITY_CHASE_DRONE) {
            chaseDrones.push(entityCopy);
        } else if (entity.type_int === ENTITY_FLOOR_GUARD) {
            floorGuards.push(entityCopy);
        } else if (entity.type_int === ENTITY_BOUNCE_BLOCK) {
            bounceBlocks.push(entityCopy);
        } else if (entity.type_int === ENTITY_THWUMP) {
            thwumps.push(entityCopy);
        } else if (entity.type_int === ENTITY_EVIL_NINJA) {
            evilNinjas.push({
                ...entityCopy,
                type: EVIL_NINJA_UNTOUCHED,
                scale: 1,
            });
        } else if (entity.type_int === ENTITY_BOOST_PAD) {
            boostPads.push({
                ...entityCopy,
                animProgress: 1,
            });
        } else if (entity.type_int === ENTITY_DEATHBALL) {
            deathballs.push(entityCopy);
        } else if (entity.type_int === ENTITY_BAT) {
            bats.push(entityCopy);
        } else if (entity.type_int === ENTITY_SHOVE_THWUMP) {
            shoveThwumps.push({
                ...entityCopy,
                touch: 16,
            });
        }
        entity.free();
    }

    entities.setNinjas(ninjas);
    entities.setMines(mines);
    entities.setGolds(golds);
    entities.setExitDoors(exitDoors);
    entities.setExitSwitches(exitSwitches);
    entities.setRegularDoors(regularDoors);
    entities.setLockedDoors(lockedDoors);
    entities.setLockedSwitches(lockedSwitches);
    entities.setTrapDoors(trapDoors);
    entities.setTrapSwitches(trapSwitches);
    entities.setLaunchPads(launchPads);
    entities.setOneWays(oneWays);
    entities.setChaingunDrones(chaingunDrones);
    entities.setLaserDrones(laserDrones);
    entities.setZapDrones(zapDrones);
    entities.setChaseDrones(chaseDrones);
    entities.setFloorGuards(floorGuards);
    entities.setBounceBlocks(bounceBlocks);
    entities.setThwumps(thwumps);
    entities.setEvilNinjas(evilNinjas);
    entities.setBoostPads(boostPads);
    entities.setDeathballs(deathballs);
    entities.setBats(bats);
    entities.setShoveThwumps(shoveThwumps);
}

function Entities({ entities }: { entities: EntitiesProps }) {
    return <>
        <TrapDoors trapDoors={entities.trapDoors} />
        <LockedDoors lockedDoors={entities.lockedDoors} />
        <LockedSwitches lockedSwitches={entities.lockedSwitches} />
        <TrapSwitches trapSwitches={entities.trapSwitches} />
        <ExitDoors exitDoors={entities.exitDoors} />
        <OneWays oneWays={entities.oneWays} />
        <Mines mines={entities.mines} />
        <Golds golds={entities.golds} />
        <ExitSwitches exitSwitches={entities.exitSwitches} />
        <RegularDoors regularDoors={entities.regularDoors} />
        <LaunchPads launchPads={entities.launchPads} />
        <LaserDrones laserDrones={entities.laserDrones} />
        <ChaingunDrones chaingunDrones={entities.chaingunDrones} />
        <ZapDrones zapDrones={entities.zapDrones} />
        <ChaseDrones chaseDrones={entities.chaseDrones} />
        <FloorGuards floorGuards={entities.floorGuards} />
        {/* micro drone */}
        <Bats bats={entities.bats} />
        <Deathballs deathballs={entities.deathballs} />
        {/* gauss */}
        {/* rocket */}
        {/* laser turret */}
        <Thwumps thwumps={entities.thwumps} />
        <EvilNinjas evilNinjas={entities.evilNinjas} />
        <For each={entities.ninjas()}>
            {ninja => <Ninja class="ninja" ninja={() => ninja} bones={() => BONES_STANDING} />}
        </For>
        <BounceBlocks bounceBlocks={entities.bounceBlocks} />
        <ShoveThwumps shoveThwumps={entities.shoveThwumps} />
        <BoostPads boostPads={entities.boostPads} />
    </>;
}

export function EditorApp(props: {
    editor: Editor,
    setReplay: Setter<Replay | undefined>,
    pastNinjas: Accessor<{ x: number, y: number }[]>,
    globalEventState: GlobalEventState,
    levelName: Accessor<string>,
    setLevelName: Setter<string>,
    roundCorners: Accessor<boolean>,
    setRoundCorners: Setter<boolean>,
    palette: Accessor<Palette | undefined>,
    setPalette: Setter<Palette | undefined>,
    dynamicFriction: Accessor<boolean>,
    setDynamicFriction: Setter<boolean>,
}) {
    const { editor, pastNinjas } = props;

    const [tilePath, setTilePath] = createSignal('');
    const [selectedTilePath, setSelectedTilePath] = createSignal('');
    const [showHalfGrid, setShowHalfGrid] = createSignal(true);
    const [showQuarterGrid, setShowQuarterGrid] = createSignal(false);
    const [mode, setMode] = createSignal(MODE_PAINT_TILES);
    const [tilemodeCrosshairPos, setTilemodeCrosshairPos] = createSignal({ row: 1, col: 1 });
    const [crosshairPos, setCrosshairPos] = createSignal({ x: 24, y: 24 });
    const [selectedTileOutlinePath, setSelectedTileOutlinePath] = createSignal('');

    const [paletteCenter, setPaletteCenter] = createSignal({ x: NaN, y: NaN });
    const [paletteSelection, setPaletteSelection] = createSignal({ x: NaN, y: NaN });

    const entities = createEntities();
    const previewEntities = createEntities();

    const [doorSwitchLines, setDoorSwitchLines] = createSignal<Line[]>([]);
    const [showTrail, setShowTrail] = createSignal(editor.get_show_trail());
    const [ninjaPreviewBones, setNinjaPreviewBones] = createSignal<Float64Array<ArrayBufferLike>>();

    const [stackCounts, setStackCounts] = createSignal<StackCounts>([]);

    const [loopPath, setLoopPath] = createSignal('');

    const keydownListener = (event: KeyboardEvent) => {
        let change = false;

        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) {
            return;
        }

        if (event.ctrlKey || event.metaKey) {
            if (event.code === 'KeyZ' && (event.ctrlKey || event.metaKey) && event.shiftKey) change = true, editor.redo();
            else if (event.code === 'KeyZ' && (event.ctrlKey || event.metaKey)) change = true, editor.undo();
            else if (event.code === 'KeyY' && (event.ctrlKey || event.metaKey)) change = true, editor.redo();

            if (change) {
                render(true);
                event.preventDefault();
            }
            return;
        }

        if (event.shiftKey) change = true, editor.press_shift();
        // Note: no else

        if (event.code === 'Enter' && editor.mode() === MODE_SPAWN_NINJA) props.setReplay(editor.to_replay(props.roundCorners(), props.dynamicFriction()));
        else if (event.code ==='Backquote') change = true, editor.press_backtick();
        else if (event.code === 'Digit1') change = true, editor.press_1(event.shiftKey);
        else if (event.code === 'Digit2') change = true, editor.press_2(event.shiftKey);
        else if (event.code === 'Digit3') change = true, editor.press_3(event.shiftKey);
        else if (event.code === 'Digit4') change = true, editor.press_4(event.shiftKey);
        else if (event.code === 'Digit5') change = true, editor.press_5(event.shiftKey);
        else if (event.code === 'Digit6') change = true, editor.press_6(event.shiftKey);
        else if (event.code === 'Digit7') change = true, editor.press_7(event.shiftKey);
        else if (event.code === 'Digit8') change = true, editor.press_8(event.shiftKey);

        else if (event.code === 'Digit9') change = true, editor.press_9();
        else if (event.code === 'Digit0') change = true, editor.press_0();
        else if (event.code === 'Minus') change = true, editor.press_dash();
        else if (event.code === 'Equal') change = true, editor.press_equals();

        else if (event.code === 'KeyQ') change = true, editor.press_q(event.shiftKey);
        else if (event.code === 'KeyW') change = true, editor.press_w(event.shiftKey);
        else if (event.code === 'KeyA') change = true, editor.press_a(event.shiftKey);
        else if (event.code === 'KeyS') change = true, editor.press_s(event.shiftKey);
        else if (event.code === 'KeyE') change = true, editor.press_e();
        else if (event.code === 'KeyD') change = true, editor.press_d();
        else if (event.code === 'KeyZ') change = true, editor.press_z();
        else if (event.code === 'KeyX') change = true, editor.press_x();
        else if (event.code === 'KeyC') change = true, editor.press_c();

        else if (event.code === 'Space') change = true, editor.press_space();
        else if (event.code === 'AltLeft') change = true, editor.press_alt_left(event.shiftKey);

        else if (event.code === 'KeyR') change = true, editor.press_r();
        else if (event.code === 'KeyT') change = true, editor.press_t();
        else if (event.code === 'KeyY') change = true, editor.press_y();
        else if (event.code === 'KeyU') change = true, editor.press_u();
        else if (event.code === 'KeyI') change = true, editor.press_i();
        else if (event.code === 'KeyO') change = true, editor.press_o();
        else if (event.code === 'KeyP') change = true, editor.press_p();
        else if (event.code === 'BracketLeft') change = true, editor.press_bracket_left();
        else if (event.code === 'BracketRight') change = true, editor.press_bracket_right();
        else if (event.code === 'KeyF') change = true, editor.press_f();
        else if (event.code === 'KeyH') change = true, editor.press_h();
        else if (event.code === 'KeyJ') change = true, editor.press_j();
        else if (event.code === 'KeyK') change = true, editor.press_k();
        else if (event.code === 'KeyL') change = true, editor.press_l();
        else if (event.code === 'KeyN') change = true, editor.press_n();
        else if (event.code === 'KeyM') change = true, editor.press_m();
        else if (event.code === 'Comma') change = true, editor.press_comma();

        else if (event.code === 'ArrowUp') change = true, editor.press_up(event.shiftKey);
        else if (event.code === 'ArrowDown') change = true, editor.press_down(event.shiftKey);
        else if (event.code === 'ArrowLeft') change = true, editor.press_left(event.shiftKey);
        else if (event.code === 'ArrowRight') change = true, editor.press_right(event.shiftKey);
        else if (event.code === 'Enter') change = true, editor.press_enter();

        else if (event.code === 'Escape') change = editor.press_escape();

        else if (event.code === 'Slash') change = true, editor.press_slash();

        // else if (event.code === 'KeyG') change = true, editor.fill_with_mines();

        if (change) {
            render(true);
            event.preventDefault();
        }
    };

    const keyupListener = (event: KeyboardEvent) => {
        let change = false;

        if (!event.shiftKey) change = true, editor.release_shift();
        // Note: no else

        if (event.code === 'KeyQ') change = true, editor.release_q();
        else if (event.code === 'KeyW') change = true, editor.release_w();
        else if (event.code === 'KeyA') change = true, editor.release_a();
        else if (event.code === 'KeyS') change = true, editor.release_s();
        else if (event.code === 'KeyE') change = true, editor.release_e();
        else if (event.code === 'KeyD') change = true, editor.release_d();
        else if (event.code === 'KeyZ') change = true, editor.release_z();
        else if (event.code === 'KeyC') change = true, editor.release_c();

        else if (event.code === 'Space') change = true, editor.release_space();
        else if (event.code === 'AltLeft') change = true, editor.release_alt_left();

        if (change) {
            render(false);
            event.preventDefault();
        }
    };

    document.addEventListener('keydown', keydownListener);
    document.addEventListener('keyup', keyupListener);

    onCleanup(() => {
        document.removeEventListener('keydown', keydownListener);
        document.removeEventListener('keyup', keyupListener);
    });

    function render(save: boolean) {
        setMode(editor.mode());

        setTilePath(editor.tiles_path());
        setSelectedTilePath(editor.selected_tiles_path());
        setTilemodeCrosshairPos({
            row: editor.tile_crosshair_row(),
            col: editor.tile_crosshair_col(),
        });

        setShowHalfGrid(editor.show_half_grid());
        setShowQuarterGrid(editor.show_quarter_grid());

        setCrosshairPos({
            x: editor.crosshair_x(),
            y: editor.crosshair_y(),
        });

        const lines: Line[] = [];

        updateEntities(entities, lines, editor.entities(), false);
        updateEntities(previewEntities, lines, editor.preview_entities(), true);
        updateStackCounts(setStackCounts, editor.entities());

        setDoorSwitchLines(lines);

        setSelectedTileOutlinePath(editor.selected_tile_outline_path());

        setPaletteCenter({
            x: editor.palette_center_x(),
            y: editor.palette_center_y(),
        });
        setPaletteSelection({
            x: editor.palette_selection_x(),
            y: editor.palette_selection_y(),
        });

        setNinjaPreviewBones(editor.past_ninja_bones());

        if (save) {
            debouncedSaveMap(editor);
            // setLoopPath(editor.loop_locations_path());
        }
    }

    const regularGridXs = [];
    for (let i = 0; i < COLS - 1; i++) {
        regularGridXs.push(48 + 24 * i);
    }
    const regularGridYs = [];
    for (let i = 0; i < ROWS - 1; i++) {
        regularGridYs.push(48 + 24 * i);
    }

    const halfTileGridXs = [];
    for (let i = 0; i < COLS; i++) {
        halfTileGridXs.push(36 + 24 * i);
    }

    const halfTileGridYs = [];
    for (let i = 0; i < ROWS; i++) {
        halfTileGridYs.push(36 + 24 * i);
    }

    const quarterTileGridXs = [];
    for (let i = 0; i < COLS * 2; i++) {
        quarterTileGridXs.push(30 + 12 * i);
    }

    const quarterTileGridYs = [];
    for (let i = 0; i < ROWS * 2; i++) {
        quarterTileGridYs.push(30 + 12 * i);
    }

    render(false);

    return <>
        <svg viewBox="0 0 1056 600" onmousemove={function(this: SVGElement, event) {
            const { left, top, width, height } = this.getBoundingClientRect();
            const cursorMoved = editor.set_cursor_pos(
                (event.clientX - left) / width * 1056,
                (event.clientY - top) / height * 600,
                event.shiftKey,
            );
            props.globalEventState.setMouseGamePos({
                x: (event.clientX - left) / width * 1056,
                y: (event.clientY - top) / height * 600,
            });
            if (cursorMoved) render(false);
        }}
        onmousedown={event => {
            if (event.buttons & 2) {
                // skip if secondary button is pressed (right click)
            } else {
                // primary click
                if (editor.mode() === MODE_SPAWN_NINJA) {
                    props.setReplay(editor.to_replay(props.roundCorners(), props.dynamicFriction()));
                } else {
                    editor.cursor_down(event.shiftKey);
                    render(true);
                }
            }
        }}
        ondblclick={event => { editor.double_click(event.shiftKey); render(false) }}
        onmouseup={() => { editor.cursor_up(); render(false) }}
        oncontextmenu={event => { if (editor.press_escape()) { render(false); event.preventDefault(); } }} >
            <defs>
                <clipPath id="tiles-clip">
                    <use href="#tiles" />
                </clipPath>
                <MineDefs />
                <GoldDefs />
                <OneWayDefs />
                <BounceBlockDefs />
                <LockedSwitchDefs />
                <TrapSwitchDefs />
                <BoostPadDefs />
                <ThwumpDefs />
                <EvilNinjaDefs />
                <ChaingunDroneDefs />
                <LaserDroneDefs />
                <ZapDroneDefs />
                <ChaseDroneDefs />
                <BatDefs />
                <DeathballDefs />
                <path id="tilemode-crosshair" stroke-width="1.5" fill="none" d={tilemodeCrosshairPath} />
                <path id="crosshair" stroke-width="1.5" fill="none" d={crosshairPath} />
                <filter id="outline" filterUnits="userSpaceOnUse" x="0" y="0" width="1056" height="600">
                    <feMorphology in="SourceAlpha" operator="dilate" radius="0.75" result="DILATED" />
                    <feFlood flood-color="var(--editor-crosshair)" flood-opacity="1" result="COLOR" />
                    <feComposite in="COLOR" in2="DILATED" operator="in" result="OUTLINE" />
                    <feMerge>
                        <feMergeNode in="OUTLINE" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <filter id="hollow">
                    <feMorphology in="SourceAlpha" operator="dilate" radius="3" result="DILATED" />
                    <feComposite operator="out" in="DILATED" in2="SourceGraphic" />
                </filter>
            </defs>
            <Show when={showQuarterGrid()}>
                {quarterTileGridXs.map(x => <line class="fine-grid" y1="24" y2={24 * 24} x1={x} x2={x} />)}
                {quarterTileGridYs.map(y => <line class="fine-grid" x1="24" x2={24 * 43} y1={y} y2={y} />)}
            </Show>
            <Show when={showHalfGrid()}>
                {halfTileGridXs.map(x => <line class="fine-grid" y1="24" y2={24 * 24} x1={x} x2={x} />)}
                {halfTileGridYs.map(y => <line class="fine-grid" x1="24" x2={24 * 43} y1={y} y2={y} />)}
            </Show>
            {regularGridXs.map(x => <line class="regular-grid" y1="24" y2={24 * 24} x1={x} x2={x} />)}
            {regularGridYs.map(y => <line class="regular-grid" x1="24" x2={24 * 43} y1={y} y2={y} />)}
            <Entities entities={entities} />
            <path id="tiles" stroke-width="2" clip-path="url(#tiles-clip)" clip-rule="evenodd" d={tilePath()} fill-rule="evenodd" />
            <For each={stackCounts()}>
                {(stackCount) => <text x={stackCount.x + 4} y={stackCount.y + 12}>{stackCount.count}</text>}
            </For>
            <Show when={mode() === MODE_ENTITY_PALETTE}>
                {/* palette background color from https://coloration-cimn.onrender.com/ */}
                <rect fill="color-mix(in srgb,var(--background) 18%,white 15%)"
                    style={{ "mix-blend-mode": "hard-light" }}
                    x={paletteCenter().x - ENTITY_PALETTE_SIZE / 2} y={paletteCenter().y - ENTITY_PALETTE_SIZE / 2} width={ENTITY_PALETTE_SIZE} height={ENTITY_PALETTE_SIZE} />
            </Show>
            <g filter={[MODE_MOVE_SELECTION, MODE_SELECT_ENTITY, MODE_MODIFY_ENTITY].includes(mode()) ? "url(#outline)" : ""}>
                <Entities entities={previewEntities} />
            </g>
            <Show when={[MODE_SELECT_ENTITY, MODE_MODIFY_ENTITY, MODE_PLACE_ENTITY].includes(mode())}>
                <ModeIndicator entities={previewEntities} />
            </Show>
            <Show when={mode() === MODE_ENTITY_PALETTE}>
                <circle fill="none" stroke="var(--entity-palette-reticle)" cx={paletteSelection().x} cy={paletteSelection().y} r={ENTITY_PALETTE_RETICLE_RADIUS} />
            </Show>
            <Show when={mode() === MODE_TILE_PALETTE}>
                <path d={TILE_PALETTE_PATH} fill-rule="evenodd" fill="color-mix(in srgb,var(--background) 18%,white 15%)" style={{ "mix-blend-mode": "hard-light" }} transform={`translate(${paletteCenter().x},${paletteCenter().y})`} />
            </Show>
            <path id="selected-tiles" d={selectedTilePath()} fill-rule="evenodd" />
            <Show when={mode() === MODE_TILE_PALETTE}>
                <rect fill="none" stroke="var(--editor-crosshair)" stroke-width="2" x={paletteSelection().x - 13} y={paletteSelection().y - 13} width="26" height="26" />
            </Show>
            <For each={doorSwitchLines()}>
                {line => <line class="door-switch-line" x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} />}
            </For>
            <g>
                <path stroke="var(--editor-crosshair)" stroke-width="2" fill="none" d={selectedTileOutlinePath()} />
            </g>
            <Show when={mode() === MODE_PAINT_TILES}>
                <use href="#tilemode-crosshair" x={tilemodeCrosshairPos().col * 24 + 12} y={tilemodeCrosshairPos().row * 24 + 12} />
            </Show>
            <Show when={mode() === MODE_PEN_TOOL || mode() === MODE_SELECT_ENTITY}>
                <use href="#crosshair" x={crosshairPos().x} y={crosshairPos().y} />
            </Show>
            <Show when={mode() === MODE_SPAWN_NINJA}>
                <Ninja class="ninja" ninja={() => ({ x: crosshairPos().x, y: crosshairPos().y, deg: 0 })} bones={() => ninjaPreviewBones() ?? BONES_FALLING} />
            </Show>
            <Show when={showTrail()}>
                <polyline stroke="var(--ninja)" fill="none" points={pastNinjas().map(({ x, y }) => `${x},${y}`).join(' ')} />
            </Show>
            <path stroke="red" fill="none" d={loopPath()} />
        </svg>
        <EditorFooter
            editor={editor}
            setReplay={props.setReplay}
            render={render}
            levelName={props.levelName}
            setLevelName={props.setLevelName}
            roundCorners={props.roundCorners}
            setRoundCorners={props.setRoundCorners}
            palette={props.palette}
            setPalette={props.setPalette}
            showTrail={showTrail}
            setShowTrail={setShowTrail}
            dynamicFriction={props.dynamicFriction}
            setDynamicFriction={props.setDynamicFriction}
        />
    </>;
}
