import { Index, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type LaserDroneData = {
    x: number;
    y: number;
    deg: number;
    mode: number;
};

function equals(a: LaserDroneData, b: LaserDroneData): boolean {
    return a.x == b.x && a.y == b.y && a.deg == b.deg;
}

function transform(laserDrone: Accessor<LaserDroneData>): string {
    const { x, y, deg } = laserDrone();
    return `translate(${x},${y}) rotate(${deg},0,0)`;
}

export function updateLaserDrones([laserDrones, setLaserDrones]: Signal<LaserDroneData[]>, replay: Replay, partialFrame: number) {
    const oldLaserDrones = laserDrones();
    const newLaserDronesLen = replay.laser_drones_len();
    const newLaserDrones: LaserDroneData[] = [];
    for (let i = 0; i < newLaserDronesLen; i++) {
        const oldLaserDrone = oldLaserDrones.at(i);
        const newLaserDrone = {
            x: replay.laser_drone_x(i, partialFrame),
            y: replay.laser_drone_y(i, partialFrame),
            deg: replay.laser_drone_deg(i),
            mode: oldLaserDrone?.mode ?? 0,
        };
        if (oldLaserDrone && equals(oldLaserDrone, newLaserDrone)) {
            newLaserDrones.push(oldLaserDrone);
        } else {
            newLaserDrones.push(newLaserDrone);
        }
    }
    setLaserDrones(newLaserDrones);
}

export function LaserDrones(props: { laserDrones: Accessor<LaserDroneData[]> }) {
    return <Index each={props.laserDrones()}>
        {laserDrone => <use href="#laserdrone" transform={transform(laserDrone)} />}
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

const laserDroneEye = `M ${r} ${-et} H ${et} A ${et} ${et} 0 0 0 0 0 A ${et} ${et} 0 0 0 ${et} ${et} H ${r} Z`;

export function LaserDroneDefs() {
    return <g id="laserdrone">
        <path fill="none" stroke="var(--laser-drone-border)" d={droneBodyPath} />
        <path fill="var(--laser-drone-border)" d={laserDroneEye} />
        <path fill="none" stroke="var(--laser-drone-border)" stroke-width={droneThick} stroke-linecap="round" d={droneBodyThick} />
    </g>;
}
