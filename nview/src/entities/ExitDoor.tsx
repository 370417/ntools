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
            animProgress: 0,//replay.exit_door_anim_progress(i, partialFrame),
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
        <path class="exit-door" d={`M 0 0 v ${-exitDoorRadius} h ${-exitDoorRadius + exitDoorCorner} l ${-exitDoorCorner} ${exitDoorCorner} v ${2 * (exitDoorRadius - exitDoorCorner)} l ${exitDoorCorner} ${exitDoorCorner} h ${exitDoorRadius - exitDoorCorner} z`} />
        <path class="exit-door" d={`M 0 0 v ${-exitDoorRadius} h ${exitDoorRadius - exitDoorCorner} l ${exitDoorCorner} ${exitDoorCorner} v ${2 * (exitDoorRadius - exitDoorCorner)} l ${-exitDoorCorner} ${exitDoorCorner} h ${-exitDoorRadius + exitDoorCorner} z`} />
        <path class="exit-door-stroke" stroke-width="3" fill="none" stroke-linecap="round" d={`M 0 0 m 0 ${(1 - 0) * exitDoorRadius} v ${(0) * exitDoorRadius} h ${-exitDoorRadius + exitDoorCorner} l ${-exitDoorCorner} ${-exitDoorCorner} v ${(1 - 0) * (-exitDoorRadius + exitDoorCorner)}`} />
        <path class="exit-door-stroke" stroke-width="3" fill="none" stroke-linecap="round" d={`M 0 0 m 0 ${(1 - 0) * exitDoorRadius} v ${(0) * exitDoorRadius} h ${exitDoorRadius - exitDoorCorner} l ${exitDoorCorner} ${-exitDoorCorner} v ${(1 - 0) * (-exitDoorRadius + exitDoorCorner)}`} />
    </g>;
}
