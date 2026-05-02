import type { Accessor, Setter } from "solid-js";
import type { Editor } from "./assets/ntools_rs";
import { debouncedSaveMap } from "./localstorage";
import { getPaletteColors, themes, type Palette } from "./palette";

export function EditorFooter(props: {
    editor: Editor,
    render(save: boolean): void,
    levelName: Accessor<string>,
    setLevelName: Setter<string>,
    roundCorners: Accessor<boolean>,
    setRoundCorners: Setter<boolean>,
    palette: Accessor<Palette | undefined>,
    setPalette: Setter<Palette | undefined>,
    showTrail: Accessor<boolean>,
    setShowTrail: Setter<boolean>,
    dynamicFriction: Accessor<boolean>,
    setDynamicFriction: Setter<boolean>,
}) {
    return <div style={{
        padding: '0 1.2em',
        color: 'var(--main-menu-text)',
    }}>
        <label style={{
            color: 'var(--main-menu-selected)',
            cursor: 'pointer',
            'text-decoration': 'underline',
        }}>
            Import map
            <input type="file" style={{ display: 'none' }} onchange={function(this: HTMLInputElement) {
                const files = this.files;
                if (files && files.length > 0) {
                    const fileReader = new FileReader();
                    fileReader.onloadend = () => {
                        if (fileReader.result instanceof ArrayBuffer) {
                            props.editor.load_map(new Uint8Array(fileReader.result));
                            props.render(true);
                            props.setLevelName(props.editor.get_level_name());
                        }
                    };
                    fileReader.readAsArrayBuffer(files[0]);
                }
            }}
            />
        </label>
        {" | "}
        <a href="#" download="Untitled" style={{
            color: 'var(--main-menu-selected)',
        }} onclick={function(this: HTMLAnchorElement) {
            const map = props.editor.export_map();
            const blob = new Blob([map.buffer as ArrayBuffer], { type: 'application/octet-stream' });
            const downloadUrl = URL.createObjectURL(blob);
            this.href = downloadUrl;
            this.download = props.editor.get_level_name().replaceAll(/[^a-z]/gi, '_');
            setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
        }}>
            Export map
        </a>
        {" | "}
        <label>Show trail <input type="checkbox" checked={props.showTrail()} onchange={e => {
            props.setShowTrail(e.currentTarget.checked);
            props.editor.set_show_trail(e.currentTarget.checked);
        }} /></label>
        {" | Object corners "}
        <select onchange={e => props.setRoundCorners(e.currentTarget.value == 'rounded')}>
            <option selected={!props.roundCorners()}>square</option>
            <option selected={props.roundCorners()}>rounded</option>
        </select>
        {" | "}
        <label>Friction mod <input type="checkbox" checked={props.dynamicFriction()} onchange={e => {
            props.setDynamicFriction(e.currentTarget.checked);
        }} /></label>
        {" | "}
        <select onchange={e => {
            const colors = getPaletteColors(e.currentTarget.value);
            if (colors) {
                props.setPalette({
                    name: e.currentTarget.value,
                    colors,
                });
            }
        }}>
            {themes.map(theme => {
                return <option selected={theme === (props.palette()?.name ?? 'vasquez')}>{theme}</option>
            })}
        </select>
        <input type="text" value={props.levelName()} style={{ float: 'right' }} oninput={e => {
            props.editor.set_level_name(e.currentTarget.value);
            props.setLevelName(props.editor.get_level_name());
        }} onchange={() => debouncedSaveMap(props.editor)} />
    </div>;
}
