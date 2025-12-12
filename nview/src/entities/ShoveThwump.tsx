import { For, Index, Show, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type ShoveThwumpData = {
    x: number;
    y: number;
    deg: number;
    touch: number;
};

function equals(a: ShoveThwumpData, b: ShoveThwumpData): boolean {
    return a.x == b.x && a.y == b.y && a.deg == b.deg && a.touch === b.touch;
}

function transform(shoveThwump: Accessor<ShoveThwumpData>): string {
    const { x, y, deg } = shoveThwump();
    return `translate(${x},${y}) rotate(${deg},0,0)`;
}

export function updateShoveThwumps([shoveThwumps, setShoveThwumps]: Signal<ShoveThwumpData[]>, replay: Replay, partialFrame: number) {
    const oldShoveThwumps = shoveThwumps();
    const newShoveThwumpsLen = replay.shove_thwumps_len();
    const newShoveThwumps: ShoveThwumpData[] = [];
    for (let i = 0; i < newShoveThwumpsLen; i++) {
        const oldShoveThwump = oldShoveThwumps.at(i);
        const newShoveThwump = {
            x: replay.shove_thwump_x(i, partialFrame),
            y: replay.shove_thwump_y(i, partialFrame),
            deg: replay.shove_thwump_deg(i),
            touch: replay.shove_thwump_touch(i),
        };
        if (oldShoveThwump && equals(oldShoveThwump, newShoveThwump)) {
            newShoveThwumps.push(oldShoveThwump);
        } else {
            newShoveThwumps.push(newShoveThwump);
        }
    }
    setShoveThwumps(newShoveThwumps);
}

export function ShoveThwumps(props: { shoveThwumps: Signal<ShoveThwumpData[]> }) {
    const [shoveThwumps] = props.shoveThwumps;

    return <Index each={shoveThwumps()}>
        {shoveThwump => <ShoveThwump shoveThwump={shoveThwump} />}
    </Index>;
}

// half width
const hw = 11.5;
// thick half length
const tl = 5.5;
// thick thickness
const tt = 3;
// core half width
const cw = 5.5;
// core border thickness
const cbt = 2;

export function ShoveThwump(props: { shoveThwump: Accessor<ShoveThwumpData> }) {
    return <g class="shove-thwump" transform={transform(props.shoveThwump)}>
        <For each={[0, 2, 4, 6]}>
            {orientation => <Show when={props.shoveThwump().touch >= 16 || orientation === props.shoveThwump().touch}><g transform={`rotate(${45 * orientation},0,0)`}>
                <line stroke="black" x1="0" y1="0" x2={hw} y2="0" />
                <line stroke="black" stroke-linecap="round" x1={hw} y1={-hw} x2={hw} y2={hw} />
                <line stroke="black" stroke-linecap="round" stroke-width={tt} x1={hw} y1={-tl} x2={hw} y2={tl} />
            </g></Show>}
        </For>
        <rect stroke-linejoin="round" stroke-width={cbt} x={-cw} y={-cw} width={2 * cw} height={2 * cw} />
    </g>;
}
