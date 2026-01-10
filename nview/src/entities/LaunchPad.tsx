import { Index, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type LaunchPadData = {
    x: number;
    y: number;
    deg: number;
};

function equals(a: LaunchPadData, b: LaunchPadData): boolean {
    return a.x == b.x && a.y == b.y && a.deg == b.deg;
}

function transform(launchPad: Accessor<LaunchPadData>): string {
    const { x, y, deg } = launchPad();
    return `translate(${x},${y}) rotate(${deg},0,0)`;
}

export function updateLaunchPads([launchPads, setLaunchPads]: Signal<LaunchPadData[]>, replay: Replay) {
    const oldLaunchPads = launchPads();
    const newLaunchPadsLen = replay.launch_pads_len();
    const newLaunchPads: LaunchPadData[] = [];
    for (let i = 0; i < newLaunchPadsLen; i++) {
        const oldLaunchPad = oldLaunchPads.at(i);
        const newLaunchPad = {
            x: replay.launch_pad_x(i),
            y: replay.launch_pad_y(i),
            deg: replay.launch_pad_deg(i),
        };
        if (oldLaunchPad && equals(oldLaunchPad, newLaunchPad)) {
            newLaunchPads.push(oldLaunchPad);
        } else {
            newLaunchPads.push(newLaunchPad);
        }
    }
    setLaunchPads(newLaunchPads);
}

export function LaunchPads(props: { launchPads: Signal<LaunchPadData[]> }) {
    const [launchPads] = props.launchPads;

    return <Index each={launchPads()}>
        {launchPad => <LaunchPad launchPad={launchPad} />}
    </Index>;
}

const thickness = 1.5;
const baseHalfLen = 7.5;
const topHalfLen = 4.5;

export function LaunchPad(props: { launchPad: Accessor<LaunchPadData> }) {
    return <g transform={transform(props.launchPad)}>
        <rect fill="var(--launch-pad-long)" x="0" y={-baseHalfLen} width={thickness} height={2 * baseHalfLen} />
        <line stroke="var(--launch-pad-short)" stroke-width={thickness} stroke-linecap="round" x1={1.5 * thickness} y1={-topHalfLen} x2={1.5 * thickness} y2={topHalfLen} />
    </g>;
}
