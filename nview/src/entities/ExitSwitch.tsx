import { Index, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

// Note: there is a bug when using Firefox where if you try hovering over an exit and
// switch stacked on top of each other in entity select mode and press x to
// change the selection, solid js fails to hide the switch from view.
// In Chrome, everything behaves as expected.

export type ExitSwitchData = {
    x: number;
    y: number;
    animProgress: number;
};

function equals(a: ExitSwitchData, b: ExitSwitchData): boolean {
    return a.x == b.x && a.y == b.y && a.animProgress === b.animProgress;
}

function transform(exitSwitch: Accessor<ExitSwitchData>): string {
    const { x, y } = exitSwitch();
    return `translate(${x},${y})`;
}

export function updateExitSwitches([exitSwitches, setExitSwitches]: Signal<ExitSwitchData[]>, replay: Replay, partialFrame: number) {
    const oldExitSwitches = exitSwitches();
    const newExitSwitchesLen = replay.exit_doors_len();
    const newExitSwitches: ExitSwitchData[] = [];
    for (let i = 0; i < newExitSwitchesLen; i++) {
        const oldExitSwitch = oldExitSwitches.at(i);
        const newExitSwitch = {
            x: replay.exit_switch_x(i),
            y: replay.exit_switch_y(i),
            animProgress: replay.exit_anim_progress(i, partialFrame),
        };
        if (oldExitSwitch && equals(oldExitSwitch, newExitSwitch)) {
            newExitSwitches.push(oldExitSwitch);
        } else {
            newExitSwitches.push(newExitSwitch);
        }
    }
    setExitSwitches(newExitSwitches);
}

export function ExitSwitches(props: { exitSwitches: Accessor<ExitSwitchData[] | null> }) {
    return <Index each={props.exitSwitches()}>
        {exitSwitch => <ExitSwitch exitSwitch={exitSwitch} />}
    </Index>;
}

const exitSwitchHalfWidth = 7;
const exitSwitchHalfHeight = 4.5;
const exitSwitchCorner = 2;
const exitSwitchCenterSize = 2;

export function ExitSwitch(props: { exitSwitch: Accessor<ExitSwitchData> }) {
    return <g transform={transform(props.exitSwitch)}>
        <path
            fill={`var(--exit-switch-background${props.exitSwitch().animProgress > 0 ? '-collected' : ''})`}
            stroke={`var(--exit-switch-border${props.exitSwitch().animProgress > 0 ? '-collected' : ''})`}
            d={`M 0 0 m ${-exitSwitchHalfWidth + exitSwitchCorner} ${-exitSwitchHalfHeight} h ${2 * (exitSwitchHalfWidth - exitSwitchCorner)} l ${exitSwitchCorner} ${exitSwitchCorner} v ${2 * (exitSwitchHalfHeight - exitSwitchCorner)} l ${-exitSwitchCorner} ${exitSwitchCorner} h ${2 * (-exitSwitchHalfWidth + exitSwitchCorner)} l ${-exitSwitchCorner} ${-exitSwitchCorner} v ${2 * (-exitSwitchHalfHeight + exitSwitchCorner)} l ${exitSwitchCorner} ${-exitSwitchCorner}`} />
        <path
            stroke="var(--exit-switch-center)"
            fill="none"
            d={`M ${-2 * props.exitSwitch().animProgress} ${-exitSwitchCenterSize} h ${-exitSwitchCenterSize} v ${2 * exitSwitchCenterSize} h ${exitSwitchCenterSize}`} />
        <path
            stroke="var(--exit-switch-center)"
            fill="none"
            d={`M ${2 * props.exitSwitch().animProgress} ${-exitSwitchCenterSize} h ${exitSwitchCenterSize} v ${2 * exitSwitchCenterSize} h ${-exitSwitchCenterSize}`} />
    </g>;
}
