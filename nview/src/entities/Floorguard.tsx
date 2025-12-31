import { Index, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type FloorGuardData = {
    x: number;
    y: number;
    deg: number;
};

function equals(a: FloorGuardData, b: FloorGuardData): boolean {
    return a.x == b.x && a.y == b.y && a.deg == b.deg;
}

function transform(floorGuard: Accessor<FloorGuardData>): string {
    const { x, y, deg } = floorGuard();
    return `translate(${x},${y}) rotate(${deg},0,0)`;
}

export function updateFloorGuards([floorGuards, setFloorGuards]: Signal<FloorGuardData[]>, replay: Replay, partialFrame: number) {
    const oldFloorGuards = floorGuards();
    const newFloorGuardsLen = replay.floor_guards_len();
    const newFloorGuards: FloorGuardData[] = [];
    for (let i = 0; i < newFloorGuardsLen; i++) {
        const oldFloorGuard = oldFloorGuards.at(i);
        const newFloorGuard = {
            x: replay.floor_guard_x(i, partialFrame),
            y: replay.floor_guard_y(i, partialFrame),
            deg: replay.floor_guard_deg(i),
        };
        if (oldFloorGuard && equals(oldFloorGuard, newFloorGuard)) {
            newFloorGuards.push(oldFloorGuard);
        } else {
            newFloorGuards.push(newFloorGuard);
        }
    }
    setFloorGuards(newFloorGuards);
}

export function FloorGuards(props: { floorGuards: Signal<FloorGuardData[]> }) {
    const [floorGuards] = props.floorGuards;

    return <Index each={floorGuards()}>
        {floorGuard => <FloorGuard floorGuard={floorGuard} />}
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

export function FloorGuard(props: { floorGuard: Accessor<FloorGuardData> }) {
    return <g transform={transform(props.floorGuard)}>
        <path d={path} />
    </g>;
}
