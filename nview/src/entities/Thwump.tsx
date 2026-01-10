import { Index, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type ThwumpData = {
    x: number;
    y: number;
    deg: number;
};

function equals(a: ThwumpData, b: ThwumpData): boolean {
    return a.x == b.x && a.y == b.y && a.deg == b.deg;
}

function transform(thwump: Accessor<ThwumpData>): string {
    const { x, y, deg } = thwump();
    return `translate(${x},${y}) rotate(${deg},0,0)`;
}

export function updateThwumps([thwumps, setThwumps]: Signal<ThwumpData[]>, replay: Replay, partialFrame: number) {
    const oldThwumps = thwumps();
    const newThwumpsLen = replay.thwumps_len();
    const newThwumps: ThwumpData[] = [];
    for (let i = 0; i < newThwumpsLen; i++) {
        const oldThwump = oldThwumps.at(i);
        const newThwump = {
            x: replay.thwump_x(i, partialFrame),
            y: replay.thwump_y(i, partialFrame),
            deg: replay.thwump_deg(i),
        };
        if (oldThwump && equals(oldThwump, newThwump)) {
            newThwumps.push(oldThwump);
        } else {
            newThwumps.push(newThwump);
        }
    }
    setThwumps(newThwumps);
}

export function Thwumps(props: { thwumps: Accessor<ThwumpData[]> }) {
    return <Index each={props.thwumps()}>
        {thwump => <use href="#thwump" transform={transform(thwump)} />}
    </Index>;
}

// outer size
const os = 9;
// stroke width
const sw = 2.5;
// inner size
const is = 8.5;
// arc radius
const ar = 2;
// arc intercept with side of thwump
const ai = 1.5;

export function ThwumpDefs() {
    return <g id="thwump">
        <rect stroke-width={sw} stroke="var(--thwump-border)" fill="var(--thwump-border)" stroke-linejoin="round" x={-os} y={-os} width={2 * os} height={2 * os} />
        <path fill="var(--thwump-interior)" d={`M ${os} ${-is} H ${ai} a ${ar} ${ar} 0 0 1 ${-ar} ${ar} H ${-is + ar} V ${is - ar} H ${ai - ar} a ${ar} ${ar} 0 0 1 ${ar} ${ar} H ${os} Z`} />
        <path fill="var(--thwump-ray)" stroke="var(--thwump-ray)" stroke-width={0.5} d={`M ${is} ${-is} H ${os + sw / 2} V ${is} H ${is} Z`} />
    </g>;
}
