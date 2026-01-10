import { Index, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type BounceBlockData = {
    x: number;
    y: number;
    deg: number;
};

function equals(a: BounceBlockData, b: BounceBlockData): boolean {
    return a.x == b.x && a.y == b.y && a.deg == b.deg;
}

function transform(bounceBlock: Accessor<BounceBlockData>): string {
    const { x, y, deg } = bounceBlock();
    return `translate(${x},${y}) rotate(${deg},0,0)`;
}

export function updateBounceBlocks([bounceBlocks, setBounceBlocks]: Signal<BounceBlockData[]>, replay: Replay, partialFrame: number) {
    const oldBounceBlocks = bounceBlocks();
    const newBounceBlocksLen = replay.bounce_blocks_len();
    const newBounceBlocks: BounceBlockData[] = [];
    for (let i = 0; i < newBounceBlocksLen; i++) {
        const oldBounceBlock = oldBounceBlocks.at(i);
        const newBounceBlock = {
            x: replay.bounce_block_x(i, partialFrame),
            y: replay.bounce_block_y(i, partialFrame),
            deg: replay.bounce_block_deg(i),
        };
        if (oldBounceBlock && equals(oldBounceBlock, newBounceBlock)) {
            newBounceBlocks.push(oldBounceBlock);
        } else {
            newBounceBlocks.push(newBounceBlock);
        }
    }
    setBounceBlocks(newBounceBlocks);
}

export function BounceBlocks(props: { bounceBlocks: Signal<BounceBlockData[]> }) {
    const [bounceBlocks] = props.bounceBlocks;

    return <Index each={bounceBlocks()}>
        {bounceBlock => <use href="#bounceblock" transform={transform(bounceBlock)} />}
    </Index>;
}

const n17 = 17 * 24 / 44;
const n17a = 4 * 24 / 44;
const n17b = 10 * 24 / 44;
const n18 = 18 * 24 / 44;
const bounceBlockPath = `M -${n18} -${n18} L ${n18} -${n18} L ${n18} ${n18} L -${n18} ${n18} Z`;
// I would use svg's stroke dasharray to make the dashed lines, but they result in artifacts
// at corners, so instead we recreate the effect with a path.
const bounceBlockStrokePath = `M -${n17} ${n17b} V ${n17} H -${n17b} M -${n17a} ${n17} H ${n17a} M ${n17b} ${n17} H ${n17} V ${n17b} M ${n17} ${n17a} V -${n17a} M ${n17} -${n17b} V -${n17} H ${n17b} M ${n17a} -${n17} H -${n17a} M -${n17b} -${n17} H -${n17} V -${n17b} M -${n17} -${n17a} V ${n17a}`;
const bounceBlockStroke = 2 * 24 / 44;

export function BounceBlockDefs() {
    return <g id="bounceblock">
        <path fill="var(--bounceblock-interior)" d={bounceBlockPath} />
        <path stroke="var(--bounceblock-border)" d={bounceBlockStrokePath} fill="none" stroke-width={bounceBlockStroke} />
    </g>;
}
