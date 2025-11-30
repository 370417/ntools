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

    function render() {
        setTilePath(editor.tiles_path());
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
        <svg viewBox="0 0 1056 600">
            <defs>
                <g id="tilemode-crosshair">
                    <path stroke-width="1.5" fill="none" d={tilemodeCrosshairPath} />
                </g>
            </defs>
            {regularGridXs.map(x => <line class="regular-grid" y1="24" y2={24 * 24} x1={x} x2={x} />)}
            {regularGridYs.map(y => <line class="regular-grid" x1="24" x2={24 * 43} y1={y} y2={y} />)}
            <path id="tiles" d={tilePath()} fill-rule="evenodd" />
            <use href="#tilemode-crosshair" x="36" y="36" />
        </svg>
    </>;
}
