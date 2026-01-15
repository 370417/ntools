import { Index, Show, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type LockedDoorData = {
    x: number;
    y: number;
    deg: number;
    animProgress: number;
};

function equals(a: LockedDoorData, b: LockedDoorData): boolean {
    return a.x == b.x && a.y == b.y && a.deg == b.deg && a.animProgress === b.animProgress;
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
            animProgress: replay.locked_door_anim_progress(i, partialFrame),
        };
        if (oldLockedDoor && equals(oldLockedDoor, newLockedDoor)) {
            newLockedDoors.push(oldLockedDoor);
        } else {
            newLockedDoors.push(newLockedDoor);
        }
    }
    setLockedDoors(newLockedDoors);
}

export function LockedDoors(props: { lockedDoors: Accessor<LockedDoorData[]> }) {
    return <Index each={props.lockedDoors()}>
        {lockedDoor => <LockedDoor lockedDoor={lockedDoor} />}
    </Index>;
}

// half width
const hw = 1;
// half height
const hh = 12 - hw;

export function LockedDoor(props: { lockedDoor: Accessor<LockedDoorData> }) {
    function centerOuterX() {
        let t = props.lockedDoor().animProgress;
        // animProgress between 0 and 0.5 -> t between 0 and 1
        // animProgress between 0.5 and 1 -> t = 1
        t = Math.min(Math.max(2 * t, 0), 1);

        return 4.5 + 4 * t;
    }

    function centerInnerX() {
        let t = props.lockedDoor().animProgress;
        // animProgress between 0 and 0.5 -> t between 0 and 1
        // animProgress between 0.5 and 1 -> t = 1
        t = Math.min(Math.max(2 * t, 0), 1);

        return 0 + 10 * t;
    }

    function barInnerX() {
        let t = props.lockedDoor().animProgress;
        // animProgress between 0 and 0.4 -> t = 0
        // animProgress between 0.4 and 1 -> t between 0 and 1
        t = Math.min(Math.max((t - 0.4) / 0.6, 0), 1);

        return 0 + (hh - 0) * t;
    }

    return <g class="locked-door" transform={transform(props.lockedDoor)}>
        <Show when={props.lockedDoor().animProgress < 1}>
            <line class="bar" stroke-width={2 * hw} x1={-hh} y1="0" x2={-barInnerX()} y2="0" />
            <line class="bar" stroke-width={2 * hw} x1={hh} y1="0" x2={barInnerX()} y2="0" />
        </Show>
        <Show when={props.lockedDoor().animProgress < 0.5}>
            <line class="center" stroke-width={4 * hw} stroke-linecap="round" x1={centerOuterX()} y1="0" x2={centerInnerX()} y2="0" />
            <line class="center" stroke-width={4 * hw} stroke-linecap="round" x1={-centerOuterX()} y1="0" x2={-centerInnerX()} y2="0" />
        </Show>
    </g>;
}
