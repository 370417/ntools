import { Index, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type ChaseDroneData = {
    x: number;
    y: number;
    deg: number;
    mode: number;
};

function equals(a: ChaseDroneData, b: ChaseDroneData): boolean {
    return a.x == b.x && a.y == b.y && a.deg == b.deg;
}

function transform(chaseDrone: Accessor<ChaseDroneData>): string {
    const { x, y, deg } = chaseDrone();
    return `translate(${x},${y}) rotate(${deg},0,0)`;
}

export function updateChaseDrones([chaseDrones, setChaseDrones]: Signal<ChaseDroneData[]>, replay: Replay, partialFrame: number) {
    const oldChaseDrones = chaseDrones();
    const newChaseDronesLen = replay.chase_drones_len();
    const newChaseDrones: ChaseDroneData[] = [];
    for (let i = 0; i < newChaseDronesLen; i++) {
        const oldChaseDrone = oldChaseDrones.at(i);
        const newChaseDrone = {
            x: replay.chase_drone_x(i, partialFrame),
            y: replay.chase_drone_y(i, partialFrame),
            deg: replay.chase_drone_deg(i),
            mode: oldChaseDrone?.mode ?? 0,
        };
        if (oldChaseDrone && equals(oldChaseDrone, newChaseDrone)) {
            newChaseDrones.push(oldChaseDrone);
        } else {
            newChaseDrones.push(newChaseDrone);
        }
    }
    setChaseDrones(newChaseDrones);
}

export function ChaseDrones(props: { chaseDrones: Accessor<ChaseDroneData[]> }) {
    return <Index each={props.chaseDrones()}>
        {chaseDrone => <use href="#chasedrone" transform={transform(chaseDrone)} />}
    </Index>;
}

// radius
const r = 10;
// bevel size
const b = 6;
const droneThick = 3;
const droneBodyPath = `M ${-r} ${r - b} V ${b - r} L ${b - r} ${-r} H ${r - b} L ${r} ${b - r} V ${r - b} L ${r - b} ${r} H ${b - r} Z`;
const droneBodyThick = `M 0 ${-r} H ${b - r} L ${-r} ${b - r} V ${r - b} L ${b - r} ${r} H 0`;

// eye half thickness
const et = 3;

const chaseDroneEye = `M ${r} ${-et} H ${et} A ${et} ${et} 0 0 0 0 0 A ${et} ${et} 0 0 0 ${et} ${et} H ${r} Z`;

export function ChaseDroneDefs() {
    return <g id="chasedrone">
        <path fill="var(--chase-drone-background)" stroke="var(--chase-drone-border)" d={droneBodyPath} />
        <path fill="var(--chase-drone-border)" d={chaseDroneEye} />
        <path fill="none" stroke="var(--chase-drone-border)" stroke-width={droneThick} stroke-linecap="round" d={droneBodyThick} />
    </g>;
}
