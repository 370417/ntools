import { Index, Show, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type GoldData = {
    x: number;
    y: number;
    collected: boolean;
};

export const MINE_TOGGLED = 0;
export const MINE_UNTOGGLED = 1;
export const MINE_TOGGLING = 2;

function equals(a: GoldData, b: GoldData): boolean {
    return a.x === b.x && a.y === b.y && a.collected === b.collected;
}

function transform(gold: Accessor<GoldData>): string {
    const { x, y } = gold();
    return `translate(${x},${y})`;
}

export function updateGolds([golds, setGolds]: Signal<GoldData[]>, replay: Replay) {
    const oldGolds = golds();
    const newGoldsLen = replay.golds_len();
    const newGolds: GoldData[] = [];
    for (let i = 0; i < newGoldsLen; i++) {
        const oldGold = oldGolds.at(i);
        const newGold = {
            x: replay.gold_x(i),
            y: replay.gold_y(i),
            collected: replay.gold_collected(i),
        };
        if (oldGold && equals(oldGold, newGold)) {
            newGolds.push(oldGold);
        } else {
            newGolds.push(newGold);
        }
    }
    setGolds(newGolds);
}

export function Golds(props: { golds: Accessor<GoldData[]> }) {
    return <Index each={props.golds()}>
        {gold => <Show when={!gold().collected}><use href="#gold" transform={transform(gold)} /></Show>}
    </Index>
}

const spokeRadius = 15 / 2 * 24 / 44;
const spokeDiag = spokeRadius / Math.pow(2, 0.5);
const spokeWidth = 2.5 * 24 / 44;
const mineInnerRadius = 3.5 * 24 / 44;
const mineOuterRadius = 5 * 24 / 44;

export function GoldDefs() {
    return <>
        <g id="gold">
            <line stroke-linecap="round" stroke-width={spokeWidth} stroke="var(--gold-exterior)" x1={-spokeRadius} y1={0} x2={spokeRadius} y2={0} />
            <line stroke-linecap="round" stroke-width={spokeWidth} stroke="var(--gold-exterior)" x1={0} y1={-spokeRadius} x2={0} y2={spokeRadius} />
            <line stroke-linecap="round" stroke-width={spokeWidth} stroke="var(--gold-exterior)" x1={-spokeDiag} y1={-spokeDiag} x2={spokeDiag} y2={spokeDiag} />
            <line stroke-linecap="round" stroke-width={spokeWidth} stroke="var(--gold-exterior)" x1={-spokeDiag} y1={spokeDiag} x2={spokeDiag} y2={-spokeDiag} />
            <circle fill="var(--gold-exterior)" r={mineOuterRadius} />
            <circle fill="var(--gold-interior)" r={mineInnerRadius} />
        </g>
    </>;
}
