import { Index, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type MineData = {
    x: number;
    y: number;
    type: typeof MINE_TOGGLED | typeof MINE_UNTOGGLED | typeof MINE_TOGGLING;
};

export const MINE_TOGGLED = 0;
export const MINE_UNTOGGLED = 1;
export const MINE_TOGGLING = 2;

function equals(a: MineData, b: MineData): boolean {
    return a.x === b.x && a.y === b.y && a.type === b.type;
}

function transform(mine: Accessor<MineData>): string {
    const { x, y } = mine();
    return `translate(${x},${y})`;
}

export function updateMines([mines, setMines]: Signal<MineData[]>, replay: Replay) {
    const oldMines = mines();
    const newMinesLen = replay.mines_len();
    const newMines: MineData[] = [];
    for (let i = 0; i < newMinesLen; i++) {
        const oldMine = oldMines.at(i);
        const newMine = {
            x: replay.mine_x(i),
            y: replay.mine_y(i),
            type: replay.mine_state(i) as 0 | 1 | 2,
        };
        if (oldMine && equals(oldMine, newMine)) {
            newMines.push(oldMine);
        } else {
            newMines.push(newMine);
        }
    }
    setMines(newMines);
}

export function Mines(props: { mines: Accessor<MineData[]> }) {
    return <Index each={props.mines()}>
        {mine => <use href={["#toggled", "#untoggled", "#toggling"][mine().type]} transform={transform(mine)} />}
    </Index>
}

const spokeRadius = 15 / 2 * 24 / 44;
const spokeDiag = spokeRadius / Math.pow(2, 0.5);
const spokeWidth = 2.5 * 24 / 44;
const mineInnerRadius = 3.5 * 24 / 44;
const mineOuterRadius = 5 * 24 / 44;
const toggleRadius = 5 * 24 / 44;
const toggleThickness = 2 * 24 / 44;

export function MineDefs() {
    return <>
        <g id="toggled">
            <line stroke-linecap="round" stroke-width={spokeWidth} stroke="var(--mine-exterior)" x1={-spokeRadius} y1={0} x2={spokeRadius} y2={0} />
            <line stroke-linecap="round" stroke-width={spokeWidth} stroke="var(--mine-exterior)" x1={0} y1={-spokeRadius} x2={0} y2={spokeRadius} />
            <line stroke-linecap="round" stroke-width={spokeWidth} stroke="var(--mine-exterior)" x1={-spokeDiag} y1={-spokeDiag} x2={spokeDiag} y2={spokeDiag} />
            <line stroke-linecap="round" stroke-width={spokeWidth} stroke="var(--mine-exterior)" x1={-spokeDiag} y1={spokeDiag} x2={spokeDiag} y2={-spokeDiag} />
            <circle fill="var(--mine-exterior)" r={mineOuterRadius} />
            <circle fill="var(--mine-interior)" r={mineInnerRadius} />
        </g>
        <g id="untoggled">
            <circle r={toggleRadius} stroke-width={toggleThickness} stroke="var(--toggle-mine)" fill="none" />
        </g>
        <g id="toggling">
            <circle r={toggleRadius} stroke-width={toggleThickness} stroke="var(--toggling-mine)" fill="none" />
        </g>
    </>;
}
