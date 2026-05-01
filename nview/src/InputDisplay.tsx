import { Index, Show, type Accessor } from "solid-js";

export function InputDisplay(props: {
    inputs: Accessor<number[]>,
}) {
    return <>
        <line stroke="var(--main-menu-text)" stroke-width="2" x1={24 * 22} x2={24 * 22} y1={24 * 24.2} y2={24 * 24.8} />
        <Index each={props.inputs()}>
            {(item, index) => <g transform={`translate(${36 + 24 * index},${24 * 24.5})`}>
                <circle r="1.5" fill="var(--background)" opacity={Number.isNaN(item()) ? 0.3 : 1} />
                <Show when={item() & 1}>
                    <path d="M 0 -9 L -3 -6 M 0 -9 L 3 -6" stroke="var(--background)" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                </Show>
                <Show when={item() & 2}>
                    <path d="M 9 0 L 6 3 M 9 0 L 6 -3" stroke="var(--background)" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                </Show>
                <Show when={item() & 4}>
                    <path d="M -9 0 L -6 3 M -9 0 L -6 -3" stroke="var(--background)" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                </Show>
            </g>}
        </Index>
    </>;
}
