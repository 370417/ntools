import { Index, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type RocketMorphData = {
    x: number;
    y: number;
    is_active: boolean;
};

function equals(a: RocketMorphData, b: RocketMorphData): boolean {
    return a.x === b.x && a.y === b.y && a.is_active == b.is_active;
}

function transform(rocketMorph: Accessor<RocketMorphData>): string {
    const { x, y } = rocketMorph();
    return `translate(${x},${y})`;
}

export function updateRocketMorphs([rocketMorphs, setRocketMorphs]: Signal<RocketMorphData[]>, replay: Replay) {
    const oldRocketMorphs = rocketMorphs();
    const newRocketMorphsLen = replay.rocket_morphs_len();
    const newRocketMorphs: RocketMorphData[] = [];
    for (let i = 0; i < newRocketMorphsLen; i++) {
        const oldRocketMorph = oldRocketMorphs.at(i);
        const newRocketMorph = {
            x: replay.rocket_morph_x(i),
            y: replay.rocket_morph_y(i),
            is_active: replay.rocket_morph_is_active(i),
        };
        if (oldRocketMorph && equals(oldRocketMorph, newRocketMorph)) {
            newRocketMorphs.push(oldRocketMorph);
        } else {
            newRocketMorphs.push(newRocketMorph);
        }
    }
    setRocketMorphs(newRocketMorphs);
}

export function RocketMorphs(props: { rocketMorphs: Accessor<RocketMorphData[]> }) {
    return <Index each={props.rocketMorphs()}>
        {rocketMorph => <use href={['#rocket-morph', '#rocket-morph-active'][Number(rocketMorph().is_active)]} transform={transform(rocketMorph)} />}
    </Index>
}

export function RocketMorphDefs() {
    return <>
        <g id="rocket-morph">
            <path d={`M 5 0 L 0 5 L -5 0 L 0 -5 Z`} fill="none" stroke="var(--rocket-turret-outer)" stroke-width="2" stroke-linecap="round" />
        </g>
        <g id="rocket-morph-active">
            <path d="M 3 5 L 8 0 L 3 -5" fill="none" stroke="var(--rocket-turret-outer)" stroke-width="2" stroke-linecap="round" />
            <path d="M -3 5 L -8 0 L -3 -5" fill="none" stroke="var(--rocket-turret-outer)" stroke-width="2" stroke-linecap="round" />
        </g>
    </>;
}
