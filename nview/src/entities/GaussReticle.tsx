import { Index, Show, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";
import { GAUSS_IDLE, GAUSS_TARGETTING, type GAUSS_POSTFIRE, type GAUSS_PREFIRE } from "./GaussTurret";

export type GaussReticleData = {
    x: number;
    y: number;
    state: typeof GAUSS_IDLE | typeof GAUSS_TARGETTING | typeof GAUSS_PREFIRE | typeof GAUSS_POSTFIRE;
    aim_region: number;
};

function equals(a: GaussReticleData, b: GaussReticleData): boolean {
    return a.x === b.x && a.y === b.y && a.state === b.state && a.aim_region === b.aim_region;
}

function transform(mine: Accessor<GaussReticleData>): string {
    const { x, y } = mine();
    return `translate(${x},${y})`;
}

export function updateGaussReticles([gauss, setGauss]: Signal<GaussReticleData[]>, replay: Replay) {
    const oldGaussReticles = gauss();
    const newGaussLen = replay.gauss_len();
    const nweGaussReticles: GaussReticleData[] = [];
    for (let i = 0; i < newGaussLen; i++) {
        const oldGauss = oldGaussReticles.at(i);
        const newGauss = {
            x: replay.gauss_aim_x(i),
            y: replay.gauss_aim_y(i),
            state: replay.gauss_state(i) as 0 | 1 | 2 | 3,
            aim_region: replay.gauss_aim_region(i),
        };
        if (oldGauss && equals(oldGauss, newGauss)) {
            nweGaussReticles.push(oldGauss);
        } else {
            nweGaussReticles.push(newGauss);
        }
    }
    setGauss(nweGaussReticles);
}

export function GaussReticles(props: { gauss: Accessor<GaussReticleData[]> }) {
    return <Index each={props.gauss()}>
        {gauss => <Show when={gauss().state != GAUSS_IDLE}>
            <use href={["#aim0", "#aim1", "#aim2", "#aim3"][gauss().aim_region]} transform={transform(gauss)} />
            <Show when={gauss().state != GAUSS_TARGETTING}>
                <use href="#gauss-crosshair" transform={transform(gauss)} />
            </Show>
        </Show>}
    </Index>
}

const aim0size = 9;
const aim0corner = 2;

const aim1size = 7;
const aim1corner = 2.5;

const aim2size = 6;
const aim2corner = 3;

const aim3size = 5;
const aim3corner = 3;

export function GaussReticleDefs() {
    return <>
        <g id="aim0">
            <path d={`M ${-aim0size} ${-aim0size + aim0corner} V ${-aim0size} h ${aim0corner} M ${aim0size - aim0corner} ${-aim0size} H ${aim0size} v ${aim0corner} M ${aim0size} ${aim0size - aim0corner} V ${aim0size} h ${-aim0corner} M ${-aim0size + aim0corner} ${aim0size} H ${-aim0size} v ${-aim0corner}`} stroke="var(--gauss-turret-crosshairs)" fill="none" />
        </g>
        <g id="aim1">
            <path d={`M ${-aim1size} ${-aim1size + aim1corner} V ${-aim1size} h ${aim1corner} M ${aim1size - aim1corner} ${-aim1size} H ${aim1size} v ${aim1corner} M ${aim1size} ${aim1size - aim1corner} V ${aim1size} h ${-aim1corner} M ${-aim1size + aim1corner} ${aim1size} H ${-aim1size} v ${-aim1corner}`} stroke="var(--gauss-turret-crosshairs)" fill="none" />
        </g>
        <g id="aim2">
            <path d={`M ${-aim2size} ${-aim2size + aim2corner} V ${-aim2size} h ${aim2corner} M ${aim2size - aim2corner} ${-aim2size} H ${aim2size} v ${aim2corner} M ${aim2size} ${aim2size - aim2corner} V ${aim2size} h ${-aim2corner} M ${-aim2size + aim2corner} ${aim2size} H ${-aim2size} v ${-aim2corner}`} stroke="var(--gauss-turret-crosshairs)" fill="none" />
        </g>
        <g id="aim3">
            <path d={`M ${-aim3size} ${-aim3size + aim3corner} V ${-aim3size} h ${aim3corner} M ${aim3size - aim3corner} ${-aim3size} H ${aim3size} v ${aim3corner} M ${aim3size} ${aim3size - aim3corner} V ${aim3size} h ${-aim3corner} M ${-aim3size + aim3corner} ${aim3size} H ${-aim3size} v ${-aim3corner}`} stroke="var(--gauss-turret-crosshairs)" fill="none" />
        </g>
        <g id="gauss-crosshair">
            <path d="M 0 -4 V 4 M -4 0 H 4" stroke="var(--gauss-turret-crosshairs)" fill="none" />
        </g>
    </>;
}
