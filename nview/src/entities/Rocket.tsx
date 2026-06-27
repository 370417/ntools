import { Index, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type RocketData = {
    x: number;
    y: number;
    deg: number;
};

function equals(a: RocketData, b: RocketData): boolean {
    return a.x === b.x && a.y === b.y && a.deg === b.deg;
}

function transform(launchPad: Accessor<RocketData>): string {
    const { x, y, deg } = launchPad();
    return `translate(${x},${y}) rotate(${deg},0,0)`;
}

export function updateRockets([rockets, setRockets]: Signal<RocketData[]>, replay: Replay, partialFrame: number) {
    const oldRockets = rockets();
    const newRocketsLen = replay.rockets_len();
    const newRockets: RocketData[] = [];
    for (let i = 0; i < newRocketsLen; i++) {
        const oldRocket = oldRockets.at(i);
        const x = replay.rocket_x(i, partialFrame);
        const y = replay.rocket_y(i, partialFrame);
        const newRocket = {
            x: Number.isFinite(x) ? x : -99,
            y: Number.isFinite(y) ? y : -99,
            deg: replay.rocket_deg(i),
        };
        if (oldRocket && equals(oldRocket, newRocket)) {
            newRockets.push(oldRocket);
        } else {
            newRockets.push(newRocket);
        }
    }
    setRockets(newRockets);
}

export function Rockets(props: { rockets: Accessor<RocketData[]> }) {
    return <Index each={props.rockets()}>
        {rocket => <use href="#rocket" transform={transform(rocket)} />}
    </Index>
}

export function RocketDefs() {
    return <g id="rocket">
        <path d="M -5 2 H 3 A 2 2 0 0 0 3 -2 H -5 Z" fill="var(--rocket)" />
    </g>
}
