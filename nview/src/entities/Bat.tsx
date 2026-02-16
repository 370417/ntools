import { Index, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type BatData = {
    x: number;
    y: number;
};

function equals(a: BatData, b: BatData): boolean {
    return a.x === b.x && a.y === b.y;
}

function transform(bat: Accessor<BatData>): string {
    const { x, y } = bat();
    return `translate(${x},${y})`;
}

// export function updateBats([bats, setBats]: Signal<BatData[]>, replay: Replay) {
//     const oldBats = bats();
//     const newBatsLen = replay.bats_len();
//     const newBats: BatData[] = [];
//     for (let i = 0; i < newBatsLen; i++) {
//         const oldBat = oldBats.at(i);
//         const newBat = {
//             x: replay.bat_x(i),
//             y: replay.bat_y(i),
//             type: replay.bat_state(i) as 0 | 1 | 2,
//         };
//         if (oldBat && equals(oldBat, newBat)) {
//             newBats.push(oldBat);
//         } else {
//             newBats.push(newBat);
//         }
//     }
//     setBats(newBats);
// }

export function Bats(props: { bats: Accessor<BatData[]> }) {
    return <Index each={props.bats()}>
        {bat => <use href="#bat" transform={transform(bat)} />}
    </Index>
}

export function BatDefs() {
    return <>
        <circle id="bat" r="5" cx="0" cy="0" fill="var(--bat-body)" />
    </>;
}
