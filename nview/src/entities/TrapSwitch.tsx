import { Index, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type TrapSwitchData = {
    x: number;
    y: number;
    wasTouched: boolean;
};

function equals(a: TrapSwitchData, b: TrapSwitchData): boolean {
    return a.x === b.x && a.y === b.y && a.wasTouched === b.wasTouched;
}

function transform(trapSwitch: Accessor<TrapSwitchData>): string {
    const { x, y } = trapSwitch();
    return `translate(${x},${y})`;
}

export function updateTrapSwitches([trapSwitches, setTrapSwitches]: Signal<TrapSwitchData[]>, replay: Replay) {
    const oldTrapSwitchs = trapSwitches();
    const newTrapSwitchsLen = replay.trap_doors_len();
    const newTrapSwitchs: TrapSwitchData[] = [];
    for (let i = 0; i < newTrapSwitchsLen; i++) {
        const oldTrapSwitch = oldTrapSwitchs.at(i);
        const newTrapSwitch = {
            x: replay.trap_switch_x(i),
            y: replay.trap_switch_y(i),
            wasTouched: replay.trap_door_anim_progress(i, 1) >= 0,
        };
        if (oldTrapSwitch && equals(oldTrapSwitch, newTrapSwitch)) {
            newTrapSwitchs.push(oldTrapSwitch);
        } else {
            newTrapSwitchs.push(newTrapSwitch);
        }
    }
    setTrapSwitches(newTrapSwitchs);
}

export function TrapSwitches(props: { trapSwitches: Signal<TrapSwitchData[]> }) {
    const [trapSwitches] = props.trapSwitches;

    return <Index each={trapSwitches()}>
        {trapSwitch => <use href={trapSwitch().wasTouched ? "#trap-switch-touched" : "#trap-switch"} transform={transform(trapSwitch)} />}
    </Index>
}

const halfSize = 1.5;

export function TrapSwitchDefs() {
    return <>
        <g id="trap-switch">
            <rect x={-halfSize} y={-halfSize} width={2 * halfSize} height={2 * halfSize} />
        </g>
        <g id="trap-switch-touched">
            <rect x={-halfSize} y={-halfSize} width={2 * halfSize} height={2 * halfSize} />
            <line x1={-halfSize} y1={-halfSize} x2={halfSize} y2={-halfSize} />
            <line x1={-halfSize} y1={halfSize} x2={halfSize} y2={halfSize} />
        </g>
    </>;
}
