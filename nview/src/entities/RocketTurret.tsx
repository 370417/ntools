import { Index, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type RocketTurretData = {
    x: number;
    y: number;
    state: typeof ROCKET_IDLE | typeof ROCKET_PREFIRE | typeof ROCKET_HOMING;
};

export const ROCKET_IDLE = 0;
export const ROCKET_PREFIRE = 1;
export const ROCKET_HOMING = 2;

function equals(a: RocketTurretData, b: RocketTurretData): boolean {
    return a.x === b.x && a.y === b.y && a.state == b.state;
}

function transform(rocketTurret: Accessor<RocketTurretData>): string {
    const { x, y } = rocketTurret();
    return `translate(${x},${y})`;
}

export function updateRocketTurrets([rocketTurrets, setRocketTurrets]: Signal<RocketTurretData[]>, replay: Replay) {
    const oldRocketTurrets = rocketTurrets();
    const newRocketTurretsLen = replay.rockets_len();
    const newRocketTurrets: RocketTurretData[] = [];
    for (let i = 0; i < newRocketTurretsLen; i++) {
        const oldRocketTurret = oldRocketTurrets.at(i);
        const newRocketTurret = {
            x: replay.rocket_turret_x(i),
            y: replay.rocket_turret_y(i),
            state: replay.rocket_state(i) as 0 | 1 | 2,
        };
        if (oldRocketTurret && equals(oldRocketTurret, newRocketTurret)) {
            newRocketTurrets.push(oldRocketTurret);
        } else {
            newRocketTurrets.push(newRocketTurret);
        }
    }
    setRocketTurrets(newRocketTurrets);
}

export function RocketTurrets(props: { rocketTurrets: Accessor<RocketTurretData[]> }) {
    return <Index each={props.rocketTurrets()}>
        {rocketTurret => <use href={["#rocket-idle", "#rocket-prefire", "#rocket-homing"][rocketTurret().state]} transform={transform(rocketTurret)} />}
    </Index>
}

const outerRadius = 6;

const idleAngle = 25;
const idleX = outerRadius * Math.cos(idleAngle * Math.PI / 180);
const idleY = outerRadius * Math.sin(idleAngle * Math.PI / 180);

const prefireAngle = 40;
const prefireX = outerRadius * Math.cos(prefireAngle * Math.PI / 180);
const prefireY = outerRadius * Math.sin(prefireAngle * Math.PI / 180);

const homingAngle = 55;
const homingX = outerRadius * Math.cos(homingAngle * Math.PI / 180);
const homingY = outerRadius * Math.sin(homingAngle * Math.PI / 180);

export function RocketTurretDefs() {
    return <>
        <g id="rocket-idle">
            <path d={`M ${-idleX} ${idleY} A ${outerRadius} ${outerRadius} 0 0 0 ${idleX} ${idleY}`} fill="none" stroke="var(--rocket-turret-outer)" stroke-width="2" stroke-linecap="round" />
            <path d={`M ${idleX} ${-idleY} A ${outerRadius} ${outerRadius} 0 0 0 ${-idleX} ${-idleY}`} fill="none" stroke="var(--rocket-turret-outer)" stroke-width="2" stroke-linecap="round" />
            <line x1="-3" y1="0" x2="3" y2="0" fill="none" stroke="var(--rocket-turret-inner)" stroke-width="2" stroke-linecap="round" />
        </g>
        <g id="rocket-prefire">
            <path d={`M ${-prefireX} ${prefireY} A ${outerRadius} ${outerRadius} 0 0 0 ${prefireX} ${prefireY}`} fill="none" stroke="var(--rocket-turret-outer)" stroke-width="2" stroke-linecap="round" />
            <path d={`M ${prefireX} ${-prefireY} A ${outerRadius} ${outerRadius} 0 0 0 ${-prefireX} ${-prefireY}`} fill="none" stroke="var(--rocket-turret-outer)" stroke-width="2" stroke-linecap="round" />
            <line x1="-2" y1="0" x2="2" y2="0" fill="none" stroke="var(--rocket-turret-inner)" stroke-width="2" stroke-linecap="round" />
        </g>
        <g id="rocket-homing">
            <path d={`M ${-homingX} ${homingY} A ${outerRadius} ${outerRadius} 0 0 0 ${homingX} ${homingY}`} fill="none" stroke="var(--rocket-turret-outer)" stroke-width="2" stroke-linecap="round" />
            <path d={`M ${homingX} ${-homingY} A ${outerRadius} ${outerRadius} 0 0 0 ${-homingX} ${-homingY}`} fill="none" stroke="var(--rocket-turret-outer)" stroke-width="2" stroke-linecap="round" />
            <circle cx="0" cy="0" r="3" fill="var(--rocket-turret-inner)" />
        </g>
    </>;
}
