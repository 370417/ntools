import { Index, Show, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type TrapDoorData = {
    x: number;
    y: number;
    deg: number;
    animProgress: number;
};

function equals(a: TrapDoorData, b: TrapDoorData): boolean {
    return a.x == b.x && a.y == b.y && a.deg == b.deg && a.animProgress === b.animProgress;
}

function transform(trapDoor: Accessor<TrapDoorData>): string {
    const { x, y, deg } = trapDoor();
    return `translate(${x},${y}) rotate(${deg},0,0)`;
}

export function updateTrapDoors([trapDoors, setTrapDoors]: Signal<TrapDoorData[]>, replay: Replay, partialFrame: number) {
    const oldTrapDoors = trapDoors();
    const newTrapDoorsLen = replay.trap_doors_len();
    const newTrapDoors: TrapDoorData[] = [];
    for (let i = 0; i < newTrapDoorsLen; i++) {
        const oldTrapDoor = oldTrapDoors.at(i);
        const newTrapDoor = {
            x: replay.trap_door_x(i),
            y: replay.trap_door_y(i),
            deg: replay.trap_door_deg(i),
            animProgress: replay.trap_door_anim_progress(i, partialFrame),
        };
        if (oldTrapDoor && equals(oldTrapDoor, newTrapDoor)) {
            newTrapDoors.push(oldTrapDoor);
        } else {
            newTrapDoors.push(newTrapDoor);
        }
    }
    setTrapDoors(newTrapDoors);
}

export function TrapDoors(props: { trapDoors: Signal<TrapDoorData[]> }) {
    const [trapDoors] = props.trapDoors;

    return <Index each={trapDoors()}>
        {trapDoor => <TrapDoor trapDoor={trapDoor} />}
    </Index>;
}

// half width
const hw = 1;
// half height
const hh = 12 - hw;

export function TrapDoor(props: { trapDoor: Accessor<TrapDoorData> }) {
    function centerOuterX() {
        let t = props.trapDoor().animProgress;

        return 6.5 * t;
    }

    function centerInnerX() {
        let t = props.trapDoor().animProgress;

        return 4 * t;
    }

    function barOuterX() {
        let t = props.trapDoor().animProgress;

        return 0 + (hh - 0) * t;
    }

    return <g class="trap-door" transform={transform(props.trapDoor)}>
        <Show when={props.trapDoor().animProgress >= 0}>
            <line class="bar" stroke-width={2 * hw} x1={-barOuterX()} y1="0" x2={barOuterX()} y2="0" />
        </Show>
        <Show when={props.trapDoor().animProgress >= 0}>
            <line class="center" stroke-width={4 * hw} stroke-linecap="round" x1={centerOuterX()} y1="0" x2={centerInnerX()} y2="0" />
            <line class="center" stroke-width={4 * hw} stroke-linecap="round" x1={-centerOuterX()} y1="0" x2={-centerInnerX()} y2="0" />
        </Show>
    </g>;
}
