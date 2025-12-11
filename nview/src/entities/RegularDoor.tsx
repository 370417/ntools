import { Index, Show, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type RegularDoorData = {
    x: number;
    y: number;
    deg: number;
    animProgress: number;
};

function equals(a: RegularDoorData, b: RegularDoorData): boolean {
    return a.x == b.x && a.y == b.y && a.deg == b.deg && a.animProgress === b.animProgress;
}

function transform(floorguard: Accessor<RegularDoorData>): string {
    const { x, y, deg } = floorguard();
    return `translate(${x},${y}) rotate(${deg},0,0)`;
}

export function updateRegularDoors([regularDoors, setRegularDoors]: Signal<RegularDoorData[]>, replay: Replay, partialFrame: number) {
    const oldRegularDoors = regularDoors();
    const newRegularDoorsLen = replay.regular_doors_len();
    const newRegularDoors: RegularDoorData[] = [];
    for (let i = 0; i < newRegularDoorsLen; i++) {
        const oldRegularDoor = oldRegularDoors.at(i);
        const newRegularDoor = {
            x: replay.regular_door_x(i),
            y: replay.regular_door_y(i),
            deg: replay.regular_door_deg(i),
            animProgress: replay.regular_door_anim_progress(i, partialFrame),
        };
        if (oldRegularDoor && equals(oldRegularDoor, newRegularDoor)) {
            newRegularDoors.push(oldRegularDoor);
        } else {
            newRegularDoors.push(newRegularDoor);
        }
    }
    setRegularDoors(newRegularDoors);
}

export function RegularDoors(props: { regularDoors: Signal<RegularDoorData[]> }) {
    const [regularDoors] = props.regularDoors;

    return <Index each={regularDoors()}>
        {regularDoor => <RegularDoor regularDoor={regularDoor} />}
    </Index>;
}

// half width
const hw = 1;
// half height
const hh = 12 - hw;

export function RegularDoor(props: { regularDoor: Accessor<RegularDoorData> }) {
    function barInnerX() {
        let t = props.regularDoor().animProgress;

        return 0 + (hh - 0) * t;
    }

    return <g class="regular-door" transform={transform(props.regularDoor)}>
        <Show when={props.regularDoor().animProgress < 1}>
            <line class="bar" stroke-width={2 * hw} x1={-hh} y1="0" x2={-barInnerX()} y2="0" />
            <line class="bar" stroke-width={2 * hw} x1={hh} y1="0" x2={barInnerX()} y2="0" />
        </Show>
    </g>;
}
