import { createSignal, For, Show } from "solid-js";
import { Editor } from "./assets/ntools_rs";
import { Ninja, type NinjaData } from "./entities/Ninja";
import { ExitDoors, type ExitDoorData } from "./entities/ExitDoor";
import { ExitSwitches, type ExitSwitchData } from "./entities/ExitSwitch";

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
const MODE_SELECT_TILES = 2;
const MODE_MOVE_SELECTION = 3;
const MODE_PLACE_ENTITY = 4;
const MODE_SELECT_ENTITIES = 5;
const MODE_MODIFY_ENTITY = 6;
const MODE_ENTITY_PALETTE = 7;
const MODE_PEN_TOOL = 8;

const ENTITY_NINJA = 0;
const ENTITY_EXIT = 3;

const BONES_STANDING = new Float32Array([-0.039, -0.0249, 0.1127, -0.1738, 0.1115, -0.1512, -0.0846, 0.0749, 0.1072, -0.0423, 0.0263, -0.1452, -0.0358, -0.075, -0.377, 0.4686, 0.4643, -0.0225, -0.0453, -0.5054, -0.4724, 0.1962, 0.2293, -0.1812, -0.2266, -0.2224]);
const BONES_FALLING = new Float32Array([0.018, 0.0, 0.4156, 0.0988, 0.3581, -0.3242, -0.0708, 0.0845, 0.2924, 0.3212, 0.1853, -0.1927, -0.0236, -0.06, -0.3602, 0.3086, 0.1278, -0.3238, -0.2018, -0.4976, -0.4488, 0.0656, -0.024, -0.2729, -0.3268, -0.2042]);

type Line = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

const selectionPadding = 5;

export function EditorApp() {
    const editor = Editor.new();

    const [tilePath, setTilePath] = createSignal('');
    const [selectedTilePath, setSelectedTilePath] = createSignal('');
    const [showHalfGrid, setShowHalfGrid] = createSignal(true);
    const [showQuarterGrid, setShowQuarterGrid] = createSignal(false);
    const [mode, setMode] = createSignal(MODE_PAINT_TILES);
    const [tilemodeCrosshairPos, setTilemodeCrosshairPos] = createSignal({ row: 1, col: 1 });
    const [crosshairPos, setCrosshairPos] = createSignal({ x: 24, y: 24 });
    const [selectedTilePositions, setSelectedTilePositions] = createSignal<{ x: number, y: number }[]>([]);

    const [ninjas, setNinjas] = createSignal<NinjaData[]>([]);
    const [exitDoors, setExitDoors] = createSignal<ExitDoorData[]>([]);
    const [exitSwitches, setExitSwitches] = createSignal<ExitSwitchData[]>([]);

    const [previewNinjas, setPreviewNinjas] = createSignal<NinjaData[]>([]);
    const [previewExitDoors, setPreviewExitDoors] = createSignal<ExitDoorData[]>([]);
    const [previewExitSwitches, setPreviewExitSwitches] = createSignal<ExitSwitchData[]>([]);

    const [doorSwitchLines, setDoorSwitchLines] = createSignal<Line[]>([]);

    document.addEventListener('keydown', event => {
        let change = false;

        if (event.code ==='Backquote') change = true, editor.press_tilde();
        else if (event.code === 'Digit1') change = true, editor.press_1(event.shiftKey);
        else if (event.code === 'Digit2') change = true, editor.press_2(event.shiftKey);
        else if (event.code === 'Digit3') change = true, editor.press_3(event.shiftKey);
        else if (event.code === 'Digit4') change = true, editor.press_4(event.shiftKey);
        else if (event.code === 'Digit5') change = true, editor.press_5(event.shiftKey);
        else if (event.code === 'Digit6') change = true, editor.press_6(event.shiftKey);
        else if (event.code === 'Digit7') change = true, editor.press_7(event.shiftKey);
        else if (event.code === 'Digit8') change = true, editor.press_8(event.shiftKey);

        else if (event.code === 'Digit9') change = true, editor.press_9();

        else if (event.code === 'KeyZ' && (event.ctrlKey || event.metaKey) && event.shiftKey) change = true, editor.redo();
        else if (event.code === 'KeyZ' && (event.ctrlKey || event.metaKey)) change = true, editor.undo();
        else if (event.code === 'KeyY' && (event.ctrlKey || event.metaKey)) change = true, editor.redo();

        else if (event.code === 'KeyQ') change = true, editor.press_q(event.shiftKey);
        else if (event.code === 'KeyW') change = true, editor.press_w(event.shiftKey);
        else if (event.code === 'KeyA') change = true, editor.press_a(event.shiftKey);
        else if (event.code === 'KeyS') change = true, editor.press_s(event.shiftKey);
        else if (event.code === 'KeyE') change = true, editor.press_e();
        else if (event.code === 'KeyD') change = true, editor.press_d();
        else if (event.code === 'KeyZ') change = true, editor.press_z();
        else if (event.code === 'KeyX') change = true, editor.press_x();
        else if (event.code === 'KeyC') change = true, editor.press_c();

        else if (event.code === 'BracketRight') change = true, editor.press_bracket_right();

        else if (event.code === 'Escape') change = editor.press_escape();

        else if (event.code === 'Slash') change = true, editor.press_slash();

        if (change) {
            render();
            event.preventDefault();
        }
    });

    document.addEventListener('keyup', event => {
        let change = false;
        if (event.code === 'KeyQ') change = true, editor.release_q();
        else if (event.code === 'KeyW') change = true, editor.release_w();
        else if (event.code === 'KeyA') change = true, editor.release_a();
        else if (event.code === 'KeyS') change = true, editor.release_s();
        else if (event.code === 'KeyE') change = true, editor.release_e();
        else if (event.code === 'KeyD') change = true, editor.release_d();
        else if (event.code === 'KeyZ') change = true, editor.release_z();
        else if (event.code === 'KeyX') change = true, editor.release_x();
        else if (event.code === 'KeyC') change = true, editor.release_c();

        if (change) {
            render();
            event.preventDefault();
        }
    });

    function render() {
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

        const selectedTilePositionsRaw = editor.selected_tile_positions();
        const selectedTilePositions: { x: number, y: number }[] = [];
        for (let i = 1; i < selectedTilePositionsRaw.length; i += 2) {
            selectedTilePositions.push({
                x: selectedTilePositionsRaw[i - 1],
                y: selectedTilePositionsRaw[i],
            });
        }
        setSelectedTilePositions(selectedTilePositions);

        const lines: Line[] = [];

        const ninjas: NinjaData[] = [];
        const exitDoors: ExitDoorData[] = [];
        const exitSwitches: ExitSwitchData[] = [];

        for (const entity of editor.entities()) {
            // Make sure to create new objects instead of reusing entity
            // because it is an object that comes from wasm.
            if (entity.type_int === ENTITY_NINJA) {
                ninjas.push({
                    x: entity.x,
                    y: entity.y,
                    deg: entity.deg,
                });
            } else if (entity.type_int === ENTITY_EXIT) {
                exitDoors.push({
                    // Note: spread operator won't work here
                    x: entity.x,
                    y: entity.y,
                    animProgress: 0,
                });
                if (!Number.isNaN(entity.switch_x)) {
                    exitSwitches.push({
                        x: entity.switch_x,
                        y: entity.switch_y,
                        animProgress: 0,
                    });
                    lines.push({
                        x1: entity.x,
                        y1: entity.y,
                        x2: entity.switch_x,
                        y2: entity.switch_y,
                    });
                }
            }
            // Do I need this?
            entity.free();
        }

        setNinjas(ninjas);
        setExitDoors(exitDoors);
        setExitSwitches(exitSwitches);

        const previewNinjas: NinjaData[] = [];
        const previewExitDoors: ExitDoorData[] = [];
        const previewExitSwitches: ExitSwitchData[] = [];

        for (const entity of editor.preview_entities()) {
            if (entity.type_int === ENTITY_NINJA) {
                previewNinjas.push({
                    x: entity.x,
                    y: entity.y,
                    deg: entity.deg,
                });
            } else if (entity.type_int === ENTITY_EXIT) {
                previewExitDoors.push({
                    // Note: spread operator won't work here
                    x: entity.x,
                    y: entity.y,
                    animProgress: 0,
                });
                if (!Number.isNaN(entity.switch_x)) {
                    previewExitSwitches.push({
                        x: entity.switch_x,
                        y: entity.switch_y,
                        animProgress: 0,
                    });
                    lines.push({
                        x1: entity.x,
                        y1: entity.y,
                        x2: entity.switch_x,
                        y2: entity.switch_y,
                    });
                }
            }
            // Do I need this?
            entity.free();
        }

        setPreviewNinjas(previewNinjas);
        setPreviewExitDoors(previewExitDoors);
        setPreviewExitSwitches(previewExitSwitches);

        setDoorSwitchLines(lines);
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

    render();

    return <>
        <svg viewBox="0 0 1056 600" onmousemove={function(this: SVGElement, event) {
            const { left, top, width, height } = this.getBoundingClientRect();
            const cursorMoved = editor.set_cursor_pos(
                (event.clientX - left) / width * 1056,
                (event.clientY - top) / height * 600,
                event.shiftKey,
            );
            if (cursorMoved) render();
        }}
        onmousedown={event => { editor.cursor_down(event.shiftKey); render() }}
        onmouseup={() => { editor.cursor_up(); render() }}
        onclick={() => { editor.cursor_click(); render() }}
        oncontextmenu={event => { if (editor.press_escape()) { render(); event.preventDefault(); } }} >
            <defs>
                <clipPath id="tiles-clip">
                    <use href="#tiles" />
                </clipPath>
                <path id="tilemode-crosshair" stroke-width="1.5" fill="none" d={tilemodeCrosshairPath} />
                <path id="crosshair" stroke-width="1.5" fill="none" d={crosshairPath} />
                <filter id="outline" filterUnits="userSpaceOnUse" x="0" y="0" width="1056" height="600">
                    <feMorphology in="SourceAlpha" operator="dilate" radius="0.5" result="DILATED" />
                    <feFlood flood-color="var(--shove-thwump-ray)" flood-opacity="1" result="COLOR" />
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
            <ExitDoors exitDoors={[exitDoors, () => {}]} />
            <ExitSwitches exitSwitches={[exitSwitches, () => {}]} />
            <For each={ninjas()}>
                {ninja => <Ninja class="ninja" ninja={() => ninja} bones={() => BONES_STANDING} />}
            </For>
            <path id="tiles" stroke-width="2" clip-path="url(#tiles-clip)" clip-rule="evenodd" d={tilePath()} fill-rule="evenodd" />
            <path id="selected-tiles" d={selectedTilePath()} fill-rule="evenodd" />
            <g filter="url(#outline)">
                <ExitDoors exitDoors={[previewExitDoors, () => {}]} />
                <ExitSwitches exitSwitches={[previewExitSwitches, () => {}]} />
                <For each={previewNinjas()}>
                    {ninja => <Ninja class="ninja" ninja={() => ninja} bones={() => BONES_STANDING} />}
                </For>
            </g>
            <For each={doorSwitchLines()}>
                {line => <line class="door-switch-line" x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} />}
            </For>
            <g filter="url(#hollow)">
                <For each={selectedTilePositions()}>
                    {({ x, y }) => <rect x={24 * x - selectionPadding} y={24 * y - selectionPadding} width={24 + 2 * selectionPadding} height={24 + 2 * selectionPadding} />}
                </For>
            </g>
            <Show when={mode() === MODE_PAINT_TILES}>
                <use href="#tilemode-crosshair" x={tilemodeCrosshairPos().col * 24 + 12} y={tilemodeCrosshairPos().row * 24 + 12} />
            </Show>
            <Show when={mode() === MODE_PEN_TOOL}>
                <use href="#crosshair" x={crosshairPos().x} y={crosshairPos().y} />
            </Show>
        </svg>
    </>;
}
