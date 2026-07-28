import { Index, Show, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";
import type { EntitiesProps } from "../Editor";
import type { LaserData } from "./LaserTurret";

// Unimplemented drone animation:
// - eye retracts and extends in the new direction
// - thick border rotates along perimeter

export type ZapDroneData = {
    x: number;
    y: number;
    deg: number;
    mode: number;
};

function equals(a: ZapDroneData, b: ZapDroneData): boolean {
    return a.x == b.x && a.y == b.y && a.deg == b.deg;
}

function transform(zapDrone: Accessor<ZapDroneData>): string {
    const { x, y, deg } = zapDrone();
    return `translate(${x},${y}) rotate(${deg},0,0)`;
}

export function updateZapDrones([zapDrones, setZapDrones]: Signal<ZapDroneData[]>, replay: Replay, partialFrame: number) {
    const oldZapDrones = zapDrones();
    const newZapDronesLen = replay.zap_drones_len();
    const newZapDrones: ZapDroneData[] = [];
    for (let i = 0; i < newZapDronesLen; i++) {
        const oldZapDrone = oldZapDrones.at(i);
        const newZapDrone = {
            x: replay.zap_drone_x(i, partialFrame),
            y: replay.zap_drone_y(i, partialFrame),
            deg: replay.zap_drone_deg(i),
            mode: oldZapDrone?.mode ?? 0,
        };
        if (oldZapDrone && equals(oldZapDrone, newZapDrone)) {
            newZapDrones.push(oldZapDrone);
        } else {
            newZapDrones.push(newZapDrone);
        }
    }
    setZapDrones(newZapDrones);
}

export function ZapDrones(props: { zapDrones: Accessor<ZapDroneData[]> }) {
    return <Index each={props.zapDrones()}>
        {zapDrone => <use href="#zapdrone" transform={transform(zapDrone)} />}
    </Index>;
}

// radius
const r = 10;
// bevel size
const b = 6;
const droneThick = 3;
const droneBodyPath = `M ${-r} ${r - b} V ${b - r} L ${b - r} ${-r} H ${r - b} L ${r} ${b - r} V ${r - b} L ${r - b} ${r} H ${b - r} Z`;
const droneBodyThick = `M 0 ${-r} H ${b - r} L ${-r} ${b - r} V ${r - b} L ${b - r} ${r} H 0`;

// eye half thickness
const et = 2;

const zapDroneEye = `M ${r} ${-et} H ${et} A ${et} ${et} 0 0 0 0 0 A ${et} ${et} 0 0 0 ${et} ${et} H ${r} Z`;

export function ZapDroneDefs() {
    return <g id="zapdrone">
        <path fill="var(--zap-drone-background)" stroke="var(--zap-drone-border)" d={droneBodyPath} />
        <path fill="var(--zap-drone-border)" d={zapDroneEye} />
        <path fill="none" stroke="var(--zap-drone-border)" stroke-width={droneThick} stroke-linecap="round" d={droneBodyThick} />
    </g>;
}

export function ModeIndicator({ entities }: { entities: EntitiesProps }) {
    const entity = () => entities.zapDrones().at(0) ?? entities.chaseDrones().at(0) ?? entities.chaingunDrones().at(0) ?? entities.laserDrones().at(0) ?? entities.laserTurrets().at(0);
    const transform = (entity: Accessor<ZapDroneData | LaserData | undefined>) => {
        const $entity = entity();
        if ($entity) {
            const { x, y, deg } = $entity;
            return `translate(${x},${y}) rotate(${deg},0,0)`;
        } else {
            return '';
        }
    };

    return <g transform={transform(entity)}>
        <Show when={entity()?.mode === 0}>
            <path fill="none" stroke="var(--mode-indicator)" d="M 12 0 a 12 12 0 0 1 12 12 a 12 12 0 0 1 -12 12 l 5 -5 m 0 10 l -5 -5" />
        </Show>
        <Show when={entity()?.mode === 1}>
            <path fill="none" stroke="var(--mode-indicator)" d="M 12 0 a 12 12 0 0 0 12 -12 a 12 12 0 0 0 -12 -12 l 5 5 m 0 -10 l -5 5" />
        </Show>
        <Show when={entity()?.mode === 2}>
            <path fill="none" stroke="var(--mode-indicator)" d="M 6 0 H 12 V 24 l -5 -5 m 10 0 l -5 5" />
        </Show>
        <Show when={entity()?.mode === 3}>
            <path fill="none" stroke="var(--mode-indicator)" d="M 6 0 H 12 V -24 l -5 5 m 10 0 l -5 -5" />
        </Show>
    </g>;
}
