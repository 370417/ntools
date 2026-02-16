import { Index, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type ChaingunDroneData = {
    x: number;
    y: number;
    deg: number;
};

function equals(a: ChaingunDroneData, b: ChaingunDroneData): boolean {
    return a.x == b.x && a.y == b.y && a.deg == b.deg;
}

function transform(chaingunDrone: Accessor<ChaingunDroneData>): string {
    const { x, y, deg } = chaingunDrone();
    return `translate(${x},${y}) rotate(${deg},0,0)`;
}

export function updateChaingunDrones([chaingunDrones, setChaingunDrones]: Signal<ChaingunDroneData[]>, replay: Replay, partialFrame: number) {
    const oldChaingunDrones = chaingunDrones();
    const newChaingunDronesLen = replay.chaingun_drones_len();
    const newChaingunDrones: ChaingunDroneData[] = [];
    for (let i = 0; i < newChaingunDronesLen; i++) {
        const oldChaingunDrone = oldChaingunDrones.at(i);
        const newChaingunDrone = {
            x: replay.chaingun_drone_x(i, partialFrame),
            y: replay.chaingun_drone_y(i, partialFrame),
            deg: replay.chaingun_drone_deg(i),
        };
        if (oldChaingunDrone && equals(oldChaingunDrone, newChaingunDrone)) {
            newChaingunDrones.push(oldChaingunDrone);
        } else {
            newChaingunDrones.push(newChaingunDrone);
        }
    }
    setChaingunDrones(newChaingunDrones);
}

export function ChaingunDrones(props: { chaingunDrones: Accessor<ChaingunDroneData[]> }) {
    return <Index each={props.chaingunDrones()}>
        {chaingunDrone => <use href="#chaingundrone" transform={transform(chaingunDrone)} />}
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
const et = 2;

const chaingunDroneEye = `M ${r} ${-et} H ${et} A ${et} ${et} 0 0 0 0 0 A ${et} ${et} 0 0 0 ${et} ${et} H ${r} Z`;

export function ChaingunDroneDefs() {
    return <g id="chaingundrone">
        <path fill="var(--chaingun-drone-background)" stroke="var(--chaingun-drone-border)" d={droneBodyPath} />
        <path fill="var(--chaingun-drone-border)" d={chaingunDroneEye} />
        <path fill="none" stroke="var(--chaingun-drone-border)" stroke-width={droneThick} stroke-linecap="round" d={droneBodyThick} />
    </g>;
}
