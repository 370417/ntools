import { Index, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type FloorguardData = {
    x: number;
    y: number;
    deg: number;
};

function equals(a: FloorguardData, b: FloorguardData): boolean {
    return a.x == b.x && a.y == b.y && a.deg == b.deg;
}

function transform(floorguard: Accessor<FloorguardData>): string {
    const { x, y, deg } = floorguard();
    return `translate(${x},${y}) rotate(${deg},0,0)`;
}

export function updateFloorguards([floorguards, setFloorguards]: Signal<FloorguardData[]>, replay: Replay, partialFrame: number) {
    const oldFloorguards = floorguards();
    const newFloorguardsLen = replay.floorguards_len();
    const newFloorguards: FloorguardData[] = [];
    for (let i = 0; i < newFloorguardsLen; i++) {
        const oldFloorguard = oldFloorguards.at(i);
        const newFloorguard = {
            x: replay.floorguard_x(i, partialFrame),
            y: replay.floorguard_y(i, partialFrame),
            deg: replay.floorguard_deg(i),
        };
        if (oldFloorguard && equals(oldFloorguard, newFloorguard)) {
            newFloorguards.push(oldFloorguard);
        } else {
            newFloorguards.push(newFloorguard);
        }
    }
    setFloorguards(newFloorguards);
}

export function Floorguards(props: { floorguards: Signal<FloorguardData[]> }) {
    const [floorguards] = props.floorguards;

    return <Index each={floorguards()}>
        {floorguard => <Floorguard floorguard={floorguard} />}
    </Index>;
}

// half width
const hw = 6.25;
// half height
const hh = 6;
// top bevel size
const bevel = 3.5;
// leg width
const leg = 2;
// height under legs
const hul = 1.5;

const path = `M ${-hw} ${hh} V ${-hh + bevel} L ${-hw + bevel} ${-hh} H ${hw - bevel} L ${hw} ${-hh + bevel} V ${hh} H ${hw - leg} l ${-hul} ${-hul} H ${-hw + leg + hul} l ${-hul} ${hul} Z`;

export function Floorguard(props: { floorguard: Accessor<FloorguardData> }) {
    return <g class="floorguard" transform={transform(props.floorguard)}>
        <path d={path} />
    </g>;
}
