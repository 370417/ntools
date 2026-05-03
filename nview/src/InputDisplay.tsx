import { Index, Show, type Accessor } from "solid-js";
import { Ninja } from "./entities/Ninja";

export function InputDisplay(props: {
    inputs: Accessor<number[]>,
    pastNinjas: Accessor<Float64Array<ArrayBufferLike>[]>,
}) {
    return <>
        <Index each={props.inputs()}>
            {(input, index) => <g transform={`translate(${36 + 24 * index},${24 * 24.5}) rotate(${rotationDeg(input())},0,0)`}>
                <Show when={!(input() > 0)}>
                    <circle r="1.5" fill="var(--background)" opacity={Number.isNaN(input()) ? 0.3 : 1} />
                </Show>
                <Show when={input() > 0}>
                    <path d="M -3 1 L 0 -3 L 3 1 L 0 -1 Z" stroke={`oklch(60% 80% ${hueDeg(input())}deg)`} fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                </Show>
            </g>}
        </Index>
        <Index each={props.pastNinjas()}>
            {(bones, index) => <Show when={bones().length}>
                <Ninja class={index === 20 ? "central-ninja" : "ninja"} ninja={() => ({ x: 48 + 24 * index, y: 24 * 24.5, deg: 0 })} bones={bones} />
            </Show>}
        </Index>
    </>;
}

function rotationDeg(input: number): number {
    switch (input) {
        // jump
        case 1:
            return 0;
        // right
        case 2:
            return 90;
        // jump and right
        case 3:
            return 45;
        // left
        case 4:
        // left and right
        case 6:
            return -90;
        // left and jump
        case 5:
        // left and right and jump
        case 7:
            return -45;
        default:
            return 180;
    }
}

function hueDeg(input: number): number {
    switch (input) {
        // jump
        case 1:
            return 140;
        // right
        case 2:
            return 270;
        // jump and right
        case 3:
            return 200;
        // left
        case 4:
        // left and right
        case 6:
            return 0;
        // left and jump
        case 5:
        // left and right and jump
        case 7:
            return 100;
        default:
            return 180;
    }
}
