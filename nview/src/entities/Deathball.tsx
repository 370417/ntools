import { Index, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type DeathballData = {
    x: number;
    y: number;
};

function equals(a: DeathballData, b: DeathballData): boolean {
    return a.x === b.x && a.y === b.y;
}

function transform(deathball: Accessor<DeathballData>): string {
    const { x, y } = deathball();
    return `translate(${x},${y}) rotate(45)`;
}

export function updateDeathballs([deathballs, setDeathballs]: Signal<DeathballData[]>, replay: Replay, partialFrame: number) {
    const oldDeathballs = deathballs();
    const newDeathballsLen = replay.deathballs_len();
    const newDeathballs: DeathballData[] = [];
    for (let i = 0; i < newDeathballsLen; i++) {
        const oldDeathball = oldDeathballs.at(i);
        const newDeathball = {
            x: replay.deathball_x(i, partialFrame),
            y: replay.deathball_y(i, partialFrame),
        };
        if (oldDeathball && equals(oldDeathball, newDeathball)) {
            newDeathballs.push(oldDeathball);
        } else {
            newDeathballs.push(newDeathball);
        }
    }
    setDeathballs(newDeathballs);
}

export function Deathballs(props: { deathballs: Accessor<DeathballData[]> }) {
    return <Index each={props.deathballs()}>
        {deathball => <use href="#deathball" transform={transform(deathball)} />}
    </Index>
}

export function DeathballDefs() {
    return <g id="deathball">
        <path d="M -7 0 A 7 7 0 0 0 0 7 A 7 7 0 0 0 7 0 A 7 7 0 0 0 0 -7" stroke="var(--deathball-outer)" stroke-width="2" fill="none" stroke-linecap="round" />
        <path d="M 0 -4 A 4 4 0 0 0 -4 0 A 4 4 0 0 0 0 4 A 4 4 0 0 0 4 0" stroke="var(--deathball-middle)" stroke-width="3" fill="none" stroke-linecap="round" />
        <circle r="2" cx="0" cy="0" fill="var(--deathball-inner)" />
    </g>;
}
