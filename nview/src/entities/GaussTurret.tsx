import { Index, Show, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type GaussData = {
    x: number;
    y: number;
    shot_x?: number;
    shot_y?: number;
    state: typeof GAUSS_IDLE | typeof GAUSS_TARGETTING | typeof GAUSS_PREFIRE | typeof GAUSS_POSTFIRE;
};

export const GAUSS_IDLE = 0;
export const GAUSS_TARGETTING = 1;
export const GAUSS_PREFIRE = 2;
export const GAUSS_POSTFIRE = 3;

function equals(a: GaussData, b: GaussData): boolean {
    return a.x === b.x && a.y === b.y && a.shot_x === b.shot_x && a.shot_y === b.shot_y && a.state == b.state;
}

function transform(rocketTurret: Accessor<GaussData>): string {
    const { x, y } = rocketTurret();
    return `translate(${x},${y})`;
}

export function updateGauss([gaussTurrets, setGauss]: Signal<GaussData[]>, replay: Replay) {
    const oldGausses = gaussTurrets();
    const newGaussLen = replay.gauss_len();
    const newGausses: GaussData[] = [];
    for (let i = 0; i < newGaussLen; i++) {
        const oldGauss = oldGausses.at(i);
        const newGauss = {
            x: replay.gauss_turret_x(i),
            y: replay.gauss_turret_y(i),
            shot_x: replay.gauss_shot_endpoint_x(i),
            shot_y: replay.gauss_shot_endpoint_y(i),
            state: replay.gauss_state(i) as 0 | 1 | 2 | 3,
        };
        if (oldGauss && equals(oldGauss, newGauss)) {
            newGausses.push(oldGauss);
        } else {
            newGausses.push(newGauss);
        }
    }
    setGauss(newGausses);
}

export function Gauss(props: { gaussTurrets: Accessor<GaussData[]> }) {
    return <Index each={props.gaussTurrets()}>
        {gauss => <>
            <use href={gauss().state > 0 ? '#gauss-active' : '#gauss-idle'} transform={transform(gauss)} />
            <Show when={typeof gauss().shot_x === 'number'}>
                <line x1={gauss().x} x2={gauss().shot_x} y1={gauss().y} y2={gauss().shot_y} stroke="black" />
            </Show>
        </>}
    </Index>
}

const outerRadius = 6;

const activeAngle = 45;
const activeX = outerRadius * Math.cos(activeAngle * Math.PI / 180);
const activeY = outerRadius * Math.sin(activeAngle * Math.PI / 180);

export function GaussDefs() {
    return <>
        <g id="gauss-idle">
            <path d={`M ${0} ${outerRadius} A ${outerRadius} ${outerRadius} 0 1 1 ${0} ${-outerRadius}`} stroke="black" stroke-width="3.5" stroke-linecap="round" fill="none" />
            <circle r={outerRadius} stroke="black" stroke-width="2" fill="none" />
            <circle r="3" fill="maroon" />
        </g>
        <g id="gauss-active">
            <path d={`M ${0} ${outerRadius} A ${outerRadius} ${outerRadius} 0 1 1 ${0} ${-outerRadius}`} stroke="black" stroke-width="3.5" stroke-linecap="round" fill="none" />
            <path d={`M ${activeX} ${activeY} A ${outerRadius} ${outerRadius} 0 1 1 ${activeX} ${-activeY}`} stroke="black" stroke-width="2" stroke-linecap="round" fill="none" />
            <circle r="3" fill="maroon" />
        </g>
    </>;
}
