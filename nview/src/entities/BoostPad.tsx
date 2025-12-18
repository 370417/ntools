import { Index, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type BoostPadData = {
    x: number;
    y: number;
    deg: number;
    animProgress: number;
};

function equals(a: BoostPadData, b: BoostPadData): boolean {
    return a.x == b.x && a.y == b.y && a.deg == b.deg && a.animProgress === b.animProgress;
}

function transform(boostPad: Accessor<BoostPadData>): string {
    const { x, y, deg } = boostPad();
    return `translate(${x},${y}) rotate(${deg},0,0)`;
}

export function updateBoostPads([boostPads, setBoostPads]: Signal<BoostPadData[]>, replay: Replay, partialFrame: number) {
    const oldBoostPads = boostPads();
    const newBoostPadsLen = replay.boost_pads_len();
    const newBoostPads: BoostPadData[] = [];
    for (let i = 0; i < newBoostPadsLen; i++) {
        const oldBoostPad = oldBoostPads.at(i);
        const newBoostPad = {
            x: replay.boost_pad_x(i),
            y: replay.boost_pad_y(i),
            deg: replay.boost_pad_deg(i, partialFrame),
            animProgress: replay.boost_pad_anim_progress(i, partialFrame),
        };
        if (oldBoostPad && equals(oldBoostPad, newBoostPad)) {
            newBoostPads.push(oldBoostPad);
        } else {
            newBoostPads.push(newBoostPad);
        }
    }
    setBoostPads(newBoostPads);
}

export function BoostPads(props: { boostPads: Signal<BoostPadData[]> }) {
    const [boostPads] = props.boostPads;

    return <Index each={boostPads()}>
        {boostPad => <use href="#boostpad" stroke={`color-mix(in srgb-linear, var(--boost-pad) ${boostPad().animProgress * 100}%, var(--boost-pad-wooshing))`} transform={transform(boostPad)} />}
    </Index>;
}

const boostPadLong = 5.5;
const boostPadMid = boostPadLong - 4.2;
const boostPadShort = boostPadMid - 4.2;

export function BoostPadDefs() {
    return <g id="boostpad" stroke-width="1.25">
        <line stroke-linecap="round" x1={boostPadLong} y1={boostPadShort} x2={-boostPadShort} y2={-boostPadLong} />
        <line stroke-linecap="round" x1={boostPadLong} y1={boostPadMid} x2={-boostPadMid} y2={-boostPadLong} />
        <line stroke-linecap="round" x1={boostPadLong} y1={boostPadLong} x2={-boostPadLong} y2={-boostPadLong} />
        <line stroke-linecap="round" x1={boostPadMid} y1={boostPadLong} x2={-boostPadLong} y2={-boostPadMid} />
        <line stroke-linecap="round" x1={boostPadShort} y1={boostPadLong} x2={-boostPadLong} y2={-boostPadShort} />
    </g>;
}
