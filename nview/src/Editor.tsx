import { createSignal } from "solid-js";
import { Editor } from "./assets/ntools_rs";

// Crosshairs
// distance from center of tile to outer edge of crosshair
const tcOuter = 13.5;
// distance from center of tile to inner endpoint of crosshair
const tcInner = 9;
const tilemodeCrosshairPath = `M ${-tcOuter} ${-tcInner} V ${-tcOuter} H ${-tcInner} M ${tcInner} ${-tcOuter} H ${tcOuter} V ${-tcInner} M ${tcOuter} ${tcInner} V ${tcOuter} H ${tcInner} M ${-tcInner} ${tcOuter} H ${-tcOuter} V ${tcInner}`;

export function EditorApp() {
    const editor = Editor.new();

    const [tilePath, setTilePath] = createSignal('');
    const [tilemodeCrosshairPos, setTilemodeCrosshairPos] = createSignal({ row: 1, col: 1 });

    document.addEventListener('keydown', event => {
        let change = false;
        if (event.code === 'KeyQ') change = true, editor.press_q();
        else if (event.code === 'KeyW') change = true, editor.press_w();
        else if (event.code === 'KeyA') change = true, editor.press_a();
        else if (event.code === 'KeyS') change = true, editor.press_s();
        else if (event.code === 'KeyE') change = true, editor.press_e();
        else if (event.code === 'KeyD') change = true, editor.press_d();

        else if (event.code === 'KeyZ' && (event.ctrlKey || event.metaKey) && event.shiftKey) change = true, editor.redo();
        else if (event.code === 'KeyZ' && (event.ctrlKey || event.metaKey)) change = true, editor.undo();
        else if (event.code === 'KeyY' && (event.ctrlKey || event.metaKey)) change = true, editor.redo();

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

        if (change) {
            render();
            event.preventDefault();
        }
    });

    function render() {
        setTilePath(editor.tiles_path());
        setTilemodeCrosshairPos({
            row: editor.tile_crosshair_row(),
            col: editor.tile_crosshair_col(),
        });
    }

    const regularGridXs = [];
    for (let i = 0; i < 41; i++) {
        regularGridXs.push(48 + 24 * i);
    }
    const regularGridYs = [];
    for (let i = 0; i < 22; i++) {
        regularGridYs.push(48 + 24 * i);
    }

    render();

    return <>
        <svg viewBox="0 0 1056 600" onmousemove={function(this: SVGElement, event) {
            const { left, top, width, height } = this.getBoundingClientRect();
            const cursorMoved = editor.set_cursor_pos(
                (event.clientX - left) / width * 1056,
                (event.clientY - top) / height * 600,
            );
            if (cursorMoved) render();
        }}>
            <defs>
                <g id="tilemode-crosshair">
                    <path stroke-width="1.5" fill="none" d={tilemodeCrosshairPath} />
                </g>
            </defs>
            {regularGridXs.map(x => <line class="regular-grid" y1="24" y2={24 * 24} x1={x} x2={x} />)}
            {regularGridYs.map(y => <line class="regular-grid" x1="24" x2={24 * 43} y1={y} y2={y} />)}
            <path id="tiles" d={tilePath()} fill-rule="evenodd" />
            <use href="#tilemode-crosshair" x={tilemodeCrosshairPos().col * 24 + 12} y={tilemodeCrosshairPos().row * 24 + 12} />
        </svg>
    </>;
}
