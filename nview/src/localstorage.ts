import type { Editor } from "./assets/ntools_rs";

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
