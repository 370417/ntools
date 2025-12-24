import type { Editor } from "./assets/ntools_rs";

export function EditorFooter(props: { editor: Editor, render(): void }) {
    return <div style={{
        padding: '0 1.2em',
    }}>
        <label>
            Import map
            <input type="file" style={{ display: 'none' }} onchange={function(this: HTMLInputElement) {
                const files = this.files;
                if (files && files.length > 0) {
                    const fileReader = new FileReader();
                    fileReader.onloadend = () => {
                        if (fileReader.result instanceof ArrayBuffer) {
                            props.editor.load_map(new Uint8Array(fileReader.result));
                            props.render();
                        }
                    };
                    fileReader.readAsArrayBuffer(files[0]);
                }
            }}
            />
        </label>
        {" | "}
        <a href="#" download="Untitled" style={{ cursor: 'default' }} onclick={function(this: HTMLAnchorElement) {
            const map = props.editor.export_map();
            const blob = new Blob([map.buffer as ArrayBuffer], { type: 'application/octet-stream' });
            const downloadUrl = URL.createObjectURL(blob);
            this.href = downloadUrl;
            // TODO: set this.download to level name
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
    </div>;
}
