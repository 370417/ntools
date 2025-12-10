import { Index, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type LockedDoorData = {
    x: number;
    y: number;
    deg: number;
};

function equals(a: LockedDoorData, b: LockedDoorData): boolean {
    return a.x == b.x && a.y == b.y && a.deg == b.deg;
}

function transform(floorguard: Accessor<LockedDoorData>): string {
    const { x, y, deg } = floorguard();
    return `translate(${x},${y}) rotate(${deg},0,0)`;
}

export function updateLockedDoors([lockedDoors, setLockedDoors]: Signal<LockedDoorData[]>, replay: Replay, partialFrame: number) {
    const oldLockedDoors = lockedDoors();
    const newLockedDoorsLen = replay.locked_doors_len();
    const newLockedDoors: LockedDoorData[] = [];
    for (let i = 0; i < newLockedDoorsLen; i++) {
        const oldLockedDoor = oldLockedDoors.at(i);
        const newLockedDoor = {
            x: replay.locked_door_x(i),
            y: replay.locked_door_y(i),
            deg: replay.locked_door_deg(i),
        };
        if (oldLockedDoor && equals(oldLockedDoor, newLockedDoor)) {
            newLockedDoors.push(oldLockedDoor);
        } else {
            newLockedDoors.push(newLockedDoor);
        }
    }
    setLockedDoors(newLockedDoors);
}

export function LockedDoors(props: { lockedDoors: Signal<LockedDoorData[]> }) {
    const [lockedDoors] = props.lockedDoors;

    return <Index each={lockedDoors()}>
        {lockedDoor => <LockedDoor lockedDoor={lockedDoor} />}
    </Index>;
}

// half width
const hw = 1;
// half height
const hh = 12 - hw;

export function LockedDoor(props: { lockedDoor: Accessor<LockedDoorData> }) {
    return <g class="lockedDoor" transform={transform(props.lockedDoor)}>
        <rect x={-hh} y={-hw} width={2 * hh} height={2 * hw} />
    </g>;
}
