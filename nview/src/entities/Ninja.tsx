import type { Accessor } from "solid-js";
import { transform } from "./common";

export type NinjaData = {
    x: number;
    y: number;
    deg: number;
};

const LIMBS = [[0, 12], [1, 12], [2, 8], [3, 9], [4, 10], [5, 11], [6, 7], [8, 0], [9, 0], [10, 1], [11, 1]];

export function Ninja(props: {
    class: string,
    ninja: Accessor<NinjaData>,
    bones: Accessor<Float64Array<ArrayBufferLike> | undefined>,
}) {
    function path() {
        const bones = props.bones();
        if (!bones) return '';
        return LIMBS/*.filter((_, i) => i === 2 || i === 3 || i == 7 || i === 8)*/.map(([i, j]) => {
            return `M ${20 * bones[i]} ${20 * bones[i + 13]} ${20 * bones[j]} ${20 * bones[j + 13]}`;
        }).join(' ');
    }

    return <path
        class={props.class}
        transform={transform(props.ninja())}
        d={path()}
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke-width={2 / 44 * 24}
    />;
}
