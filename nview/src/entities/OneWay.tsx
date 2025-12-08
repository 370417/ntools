import { Index, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type OneWayData = {
    x: number;
    y: number;
    deg: number;
};

function equals(a: OneWayData, b: OneWayData): boolean {
    return a.x === b.x && a.y === b.y && a.deg === b.deg;
}

function transform(launchPad: Accessor<OneWayData>): string {
    const { x, y, deg } = launchPad();
    return `translate(${x},${y}) rotate(${deg},0,0)`;
}

export function updateOneWays([oneWays, setOneWays]: Signal<OneWayData[]>, replay: Replay) {
    const oldOneWays = oneWays();
    const newOneWaysLen = replay.one_ways_len();
    const newOneWays: OneWayData[] = [];
    for (let i = 0; i < newOneWaysLen; i++) {
        const oldOneWay = oldOneWays.at(i);
        const newOneWay = {
            x: replay.one_way_x(i),
            y: replay.one_way_y(i),
            deg: replay.one_way_deg(i),
        };
        if (oldOneWay && equals(oldOneWay, newOneWay)) {
            newOneWays.push(oldOneWay);
        } else {
            newOneWays.push(newOneWay);
        }
    }
    setOneWays(newOneWays);
}

export function OneWays(props: { oneWays: Signal<OneWayData[]> }) {
    const [oneWays] = props.oneWays;

    return <Index each={oneWays()}>
        {oneWay => <use href="#one-way" transform={transform(oneWay)} />}
    </Index>
}

const oneWayHalfWidth = 12;
const oneWayHalfWidthSmall = 9;
const oneWayLineSpacing = 2;
const thickness = 1;

export function OneWayDefs() {
    return <g id="one-way">
        <rect class="long" x={-thickness} y={-oneWayHalfWidth} width={thickness} height={2 * oneWayHalfWidth} />
        <rect class="short" x={-2 * thickness - oneWayLineSpacing} y={-oneWayHalfWidthSmall} width={thickness} height={2 * oneWayHalfWidthSmall} />
    </g>
}
