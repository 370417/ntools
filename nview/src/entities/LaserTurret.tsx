import { Index, Show, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type LaserData = {
    x: number;
    y: number;
    deg: number;
    mode: number;
    end_x?: number;
    end_y?: number;
};

function equals(a: LaserData, b: LaserData): boolean {
    return a.x === b.x && a.y === b.y && a.deg === b.deg && a.mode === b.mode && a.end_x === b.end_x && a.end_y === b.end_y;
}

function transform(laserTurret: Accessor<LaserData>): string {
    const { x, y, deg } = laserTurret();
    return `translate(${x},${y}) rotate(${deg},0,0)`;
}

export function updateLaserTurrets([laserTurrets, setLaser]: Signal<LaserData[]>, replay: Replay, partialFrame: number) {
    const oldLasers = laserTurrets();
    const newLaserLen = replay.laser_turrets_len();
    const newLasers: LaserData[] = [];
    for (let i = 0; i < newLaserLen; i++) {
        const oldLaser = oldLasers.at(i);
        const newLaser = {
            x: replay.laser_turret_x(i, partialFrame),
            y: replay.laser_turret_y(i, partialFrame),
            deg: replay.laser_turret_deg(i, partialFrame),
            mode: 0, // always set to 0 because it has no visual significance
            end_x: replay.laser_turret_end_x(i, partialFrame),
            end_y: replay.laser_turret_end_y(i, partialFrame),
        };
        if (oldLaser && equals(oldLaser, newLaser)) {
            newLasers.push(oldLaser);
        } else {
            newLasers.push(newLaser);
        }
    }
    setLaser(newLasers);
}

export function LaserTurrets(props: { laserTurrets: Accessor<LaserData[]> }) {
    return <Index each={props.laserTurrets()}>
        {laser => <>
            <Show when={typeof laser().end_x === 'number'}>
                <line x1={laser().x} x2={laser().end_x} y1={laser().y} y2={laser().end_y} stroke="var(--laser-turret-beam)" />
            </Show>
            <use href="#laser-turret" transform={transform(laser)} />
        </>}
    </Index>
}

const outerRadius = 4.5;

const angle = 45;
const x = outerRadius * Math.cos(angle * Math.PI / 180);
const y = outerRadius * Math.sin(angle * Math.PI / 180);

export function LaserTurretDefs() {
    return <g id="laser-turret">
        <path d={`M ${x} ${y} A ${outerRadius} ${outerRadius} 0 1 1 ${x} ${-y}`} stroke="var(--laser-turret-body)" stroke-width="2" stroke-linecap="round" fill="none" />
        <circle r="1.5" fill="var(--laser-turret-body)" />
    </g>;
}
