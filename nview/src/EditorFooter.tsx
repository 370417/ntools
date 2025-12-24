import type { Accessor, Setter } from "solid-js";
import type { Editor } from "./assets/ntools_rs";

export function EditorFooter(props: { editor: Editor, render(): void, levelName: Accessor<string>, setLevelName: Setter<string> }) {
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
                            props.render();
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
            this.download = props.editor.get_level_name();
            setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
        }}>
            Export map
        </a>
        {" | "}
        Always show trail <input type="checkbox" />
        |
        Bounce block/thwump/shwump corners
        <select>
            <option>square</option>
            <option>rounded</option>
        </select>
        <input type="text" value={props.levelName()} style={{ float: 'right' }} oninput={e => {
            props.editor.set_level_name(e.currentTarget.value);
            props.setLevelName(props.editor.get_level_name());
        }} />
    </div>;
}
