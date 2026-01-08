import { set_anim_data, type Editor } from "./assets/ntools_rs";
import type { Palette } from "./palette";

export const debouncedSaveMap = debounce((editor: Editor) => {
    // encode bytes into string (non printable chars are safe)
    const mapStr = String.fromCharCode(...editor.export_map());
    localStorage.setItem('map', mapStr);
}, 1000);

export function loadMap(editor: Editor): boolean {
    const mapStr = localStorage.getItem('map');
    if (mapStr) {
        // decode bytes from string
        const mapArray = Uint8Array.from(mapStr, c => c.charCodeAt(0));
        editor.load_map(mapArray);
    }
    return !!mapStr;
}

export function saveAnimData(data: Uint8Array<ArrayBufferLike>) {
    const animDataStr = String.fromCharCode(...data);
    localStorage.setItem('animData', animDataStr);
}

export function loadAnimData() {
    const animDataStr = localStorage.getItem('animData');
    if (animDataStr) {
        const animDataArray = Uint8Array.from(animDataStr, c => c.charCodeAt(0));
        set_anim_data(animDataArray);
    }
}

export const debouncedSavePalette = debounce(savePalette, 1000);

function savePalette(palette: Palette) {
    const paletteStr = JSON.stringify(palette);
    localStorage.setItem('palette', paletteStr);
}

export function loadPalette(): Palette | undefined {
    const paletteStr = localStorage.getItem('palette');
    if (!paletteStr) return;
    try {
        const palette = JSON.parse(paletteStr);
        if (typeof palette?.name === 'string' && typeof palette?.colors === 'object') {
            return palette;
        }
    } catch (e) {
        return;
    }
}

function debounce<F extends (...args: any[]) => void>(
    fn: F,
    delay: number
): (...args: Parameters<F>) => void {
    let timeoutId: number | undefined;

    return (...args: Parameters<F>) => {
        if (typeof timeoutId === 'number') clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}
