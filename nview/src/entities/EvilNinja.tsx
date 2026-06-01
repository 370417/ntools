import { Index, Match, Switch, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";
import { Ninja } from "./Ninja";

export type EvilNinjaData = {
    x: number;
    y: number;
    deg: number;
    type: typeof EVIL_NINJA_UNTOUCHED | typeof EVIL_NINJA_ACTIVATING | typeof EVIL_NINJA_ACTIVE;
    scale: number;
    bones?: Float64Array<ArrayBufferLike>;
};

export const EVIL_NINJA_UNTOUCHED = 0;
export const EVIL_NINJA_ACTIVATING = 1;
export const EVIL_NINJA_ACTIVE = 2;

function equals(a: EvilNinjaData, b: EvilNinjaData): boolean {
    // if type is EVIL_NINJA_ACTIVE, just always return false instead of trying to compare bone data
    if (a.type === EVIL_NINJA_ACTIVE || b.type === EVIL_NINJA_ACTIVE) {
        return false;
    }
    return a.x === b.x && a.y === b.y && a.deg === b.deg && a.type === b.type && a.scale == b.scale;
}

function transform(evilNinja: Accessor<EvilNinjaData>): string {
    const { x, y, deg, scale } = evilNinja();
    return `translate(${x},${y}) rotate(${deg},0,0) scale(${scale})`;
}

export function updateEvilNinjas([evilNinjas, setEvilNinjas]: Signal<EvilNinjaData[]>, replay: Replay, partialFrame: number) {
    const oldEvilNinjas = evilNinjas();
    const newEvilNinjasLen = replay.evil_ninjas_len();
    const newEvilNinjas: EvilNinjaData[] = [];
    for (let i = 0; i < newEvilNinjasLen; i++) {
        const oldEvilNinja = oldEvilNinjas.at(i);
        const newEvilNinja = {
            x: replay.evil_ninja_x(i, partialFrame),
            y: replay.evil_ninja_y(i, partialFrame),
            deg: replay.evil_ninja_deg(i, partialFrame),
            scale: replay.evil_ninja_scale(i),
            bones: replay.evil_ninja_bones(i),
            type: replay.evil_ninja_type(i) as 0 | 1 | 2,
        };
        if (oldEvilNinja && equals(oldEvilNinja, newEvilNinja)) {
            newEvilNinjas.push(oldEvilNinja);
        } else {
            newEvilNinjas.push(newEvilNinja);
        }
    }
    setEvilNinjas(newEvilNinjas);
}

export function EvilNinjas(props: { evilNinjas: Accessor<EvilNinjaData[]> }) {
    return <Index each={props.evilNinjas()}>
        {evilNinja => <Switch>
            <Match when={evilNinja().type === EVIL_NINJA_UNTOUCHED}>
                <use href="#evilninja" transform={transform(evilNinja)} stroke="var(--evil-ninja)" />
            </Match>
            <Match when={evilNinja().type === EVIL_NINJA_ACTIVATING}>
                <use href="#evilninja" transform={transform(evilNinja)} stroke="var(--ninja)" />
            </Match>
            <Match when={evilNinja().type === EVIL_NINJA_ACTIVE}>
                <Ninja class="ninja preview" ninja={evilNinja} bones={() => evilNinja().bones} />
            </Match>
        </Switch>}
    </Index>
}

const thickness = 2 * 24 / 44;

export function EvilNinjaDefs() {
    return <>
        <g id="evilninja">
            <path d="M 2 -5 l -2 -2 h -5" transform="rotate(  0,0,0)" fill="none" stroke-width={thickness} />
            <path d="M 2 -5 l -2 -2 h -5" transform="rotate( 45,0,0)" fill="none" stroke-width={thickness} />
            <path d="M 2 -5 l -2 -2 h -5" transform="rotate( 90,0,0)" fill="none" stroke-width={thickness} />
            <path d="M 2 -5 l -2 -2 h -5" transform="rotate(135,0,0)" fill="none" stroke-width={thickness} />
            <path d="M 2 -5 l -2 -2 h -5" transform="rotate(180,0,0)" fill="none" stroke-width={thickness} />
            <path d="M 2 -5 l -2 -2 h -5" transform="rotate(225,0,0)" fill="none" stroke-width={thickness} />
            <path d="M 2 -5 l -2 -2 h -5" transform="rotate(270,0,0)" fill="none" stroke-width={thickness} />
            <path d="M 2 -5 l -2 -2 h -5" transform="rotate(315,0,0)" fill="none" stroke-width={thickness} />
        </g>
    </>;
}
