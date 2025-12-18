import { Index, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type ExitDoorData = {
    x: number;
    y: number;
    animProgress: number;
};

function equals(a: ExitDoorData, b: ExitDoorData): boolean {
    return a.x == b.x && a.y == b.y && a.animProgress === b.animProgress;
}

function transform(exitDoor: Accessor<ExitDoorData>): string {
    const { x, y } = exitDoor();
    return `translate(${x},${y})`;
}

export function updateExitDoors([exitDoors, setExitDoors]: Signal<ExitDoorData[]>, replay: Replay, partialFrame: number) {
    const oldExitDoors = exitDoors();
    const newExitDoorsLen = replay.exit_doors_len();
    const newExitDoors: ExitDoorData[] = [];
    for (let i = 0; i < newExitDoorsLen; i++) {
        const oldExitDoor = oldExitDoors.at(i);
        const newExitDoor = {
            x: replay.exit_door_x(i),
            y: replay.exit_door_y(i),
            animProgress: replay.exit_anim_progress(i, partialFrame),
        };
        if (oldExitDoor && equals(oldExitDoor, newExitDoor)) {
            newExitDoors.push(oldExitDoor);
        } else {
            newExitDoors.push(newExitDoor);
        }
    }
    setExitDoors(newExitDoors);
}

export function ExitDoors(props: { exitDoors: Signal<ExitDoorData[]> }) {
    const [exitDoors] = props.exitDoors;

    return <Index each={exitDoors()}>
        {exitDoor => <ExitDoor exitDoor={exitDoor} />}
    </Index>;
}

const exitDoorRadius = 11;
const exitDoorCorner = 2.5;

export function ExitDoor(props: { exitDoor: Accessor<ExitDoorData> }) {
    return <g transform={transform(props.exitDoor)}>
        <rect fill="url(#exit-gradient)" x={-13 + 4 * (1 - props.exitDoor().animProgress)} y={-11} width={26 - 8 * (1 - props.exitDoor().animProgress)} height={23} />
        <path fill="var(--exit-panel)" stroke="var(--exit-border)" d={`M ${-13 * props.exitDoor().animProgress} 0 v ${-exitDoorRadius} h ${-exitDoorRadius + exitDoorCorner} l ${-exitDoorCorner} ${exitDoorCorner} v ${2 * (exitDoorRadius - exitDoorCorner)} l ${exitDoorCorner} ${exitDoorCorner} h ${exitDoorRadius - exitDoorCorner} z`} />
        <path fill="var(--exit-panel)" stroke="var(--exit-border)" d={`M ${13 * props.exitDoor().animProgress} 0 v ${-exitDoorRadius} h ${exitDoorRadius - exitDoorCorner} l ${exitDoorCorner} ${exitDoorCorner} v ${2 * (exitDoorRadius - exitDoorCorner)} l ${-exitDoorCorner} ${exitDoorCorner} h ${-exitDoorRadius + exitDoorCorner} z`} />
        <path stroke="var(--exit-border)" stroke-width="3" fill="none" stroke-linecap="round" d={`M ${-13 * props.exitDoor().animProgress} 0 m 0 ${(1 - props.exitDoor().animProgress) * exitDoorRadius} v ${props.exitDoor().animProgress * exitDoorRadius} h ${-exitDoorRadius + exitDoorCorner + props.exitDoor().animProgress} l ${-exitDoorCorner} ${-exitDoorCorner} v ${(1 - props.exitDoor().animProgress) * (-exitDoorRadius + exitDoorCorner)}`} />
        <path stroke="var(--exit-border)" stroke-width="3" fill="none" stroke-linecap="round" d={`M ${13 * props.exitDoor().animProgress} 0 m 0 ${(1 - props.exitDoor().animProgress) * exitDoorRadius} v ${props.exitDoor().animProgress * exitDoorRadius} h ${exitDoorRadius - exitDoorCorner - props.exitDoor().animProgress} l ${exitDoorCorner} ${-exitDoorCorner} v ${(1 - props.exitDoor().animProgress) * (-exitDoorRadius + exitDoorCorner)}`} />
    </g>;
}

export function ExitDoorGradient() {
    return <linearGradient id="exit-gradient" x1="0" x2="0" y1="1" y2="0">
        <stop offset="0%" stop-color="var(--open-exit-lower)" />
        <stop offset="16%" stop-color="var(--open-exit-lower)" />
        <stop offset="16%" stop-color="var(--open-exit-upper)" />
        <stop offset="19%" stop-color="var(--open-exit-upper)" />
        <stop offset="19%" stop-color="var(--open-exit-lower)" />
        <stop offset="30%" stop-color="var(--open-exit-lower)" />
        <stop offset="30%" stop-color="var(--open-exit-upper)" />
        <stop offset="37%" stop-color="var(--open-exit-upper)" />
        <stop offset="37%" stop-color="var(--open-exit-lower)" />
        <stop offset="44%" stop-color="var(--open-exit-lower)" />
        <stop offset="44%" stop-color="var(--open-exit-upper)" />
        <stop offset="60%" stop-color="var(--open-exit-upper)" />
        <stop offset="60%" stop-color="var(--open-exit-lower)" />
        <stop offset="65%" stop-color="var(--open-exit-lower)" />
        <stop offset="65%" stop-color="var(--open-exit-upper)" />
        <stop offset="100%" stop-color="var(--open-exit-upper)" />
    </linearGradient>;
}
