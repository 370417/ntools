import { Index, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type LockedSwitchData = {
    x: number;
    y: number;
    wasTouched: boolean;
};

function equals(a: LockedSwitchData, b: LockedSwitchData): boolean {
    return a.x === b.x && a.y === b.y && a.wasTouched === b.wasTouched;
}

function transform(lockedSwitch: Accessor<LockedSwitchData>): string {
    const { x, y } = lockedSwitch();
    return `translate(${x},${y})`;
}

export function updateLockedSwitches([lockedSwitches, setLockedSwitches]: Signal<LockedSwitchData[]>, replay: Replay) {
    const oldLockedSwitchs = lockedSwitches();
    const newLockedSwitchsLen = replay.locked_doors_len();
    const newLockedSwitchs: LockedSwitchData[] = [];
    for (let i = 0; i < newLockedSwitchsLen; i++) {
        const oldLockedSwitch = oldLockedSwitchs.at(i);
        const newLockedSwitch = {
            x: replay.locked_switch_x(i),
            y: replay.locked_switch_y(i),
            wasTouched: replay.locked_door_anim_progress(i, 1) >= 0,
        };
        if (oldLockedSwitch && equals(oldLockedSwitch, newLockedSwitch)) {
            newLockedSwitchs.push(oldLockedSwitch);
        } else {
            newLockedSwitchs.push(newLockedSwitch);
        }
    }
    setLockedSwitches(newLockedSwitchs);
}

export function LockedSwitches(props: { lockedSwitches: Signal<LockedSwitchData[]> }) {
    const [lockedSwitches] = props.lockedSwitches;

    return <Index each={lockedSwitches()}>
        {lockedSwitch => <use href={lockedSwitch().wasTouched ? "#locked-switch-touched" : "#locked-switch"} transform={transform(lockedSwitch)} />}
    </Index>
}

const halfSize = 3.25;
const dashSize = 1.5;
const dashWidth = 1;

export function LockedSwitchDefs() {
    return <>
        <g id="locked-switch">
            <rect x={-halfSize} y={-halfSize} width={2 * halfSize} height={2 * halfSize} />
            <line x1={-dashSize} y1="-0.5" x2={dashSize} y2="-0.5" stroke-width={dashWidth} />
        </g>
        <g id="locked-switch-touched">
            <rect x={-halfSize} y={-halfSize} width={2 * halfSize} height={2 * halfSize} />
            <line x1={-dashSize} y1="0.5" x2={dashSize} y2="0.5" stroke-width={dashWidth} />
        </g>
    </>;
}
