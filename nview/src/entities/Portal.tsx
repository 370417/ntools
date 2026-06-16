import { Index, Show, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type PortalData = {
    x: number;
    y: number;
    deg: number;
    mode: number;
};

function equals(a: PortalData, b: PortalData): boolean {
    return a.x == b.x && a.y == b.y && a.deg == b.deg && a.mode === b.mode;
}

function transform(floorguard: Accessor<PortalData>): string {
    const { x, y, deg } = floorguard();
    return `translate(${x},${y}) rotate(${deg},0,0)`;
}

// export function updatePortals([portals, setPortals]: Signal<PortalData[]>, replay: Replay, partialFrame: number) {
//     const oldPortals = portals();
//     const newPortalsLen = replay.portals_len();
//     const newPortals: PortalData[] = [];
//     for (let i = 0; i < newPortalsLen; i++) {
//         const oldPortal = oldPortals.at(i);
//         const newPortal = {
//             x: replay.portal_x(i),
//             y: replay.portal_y(i),
//             deg: replay.portal_deg(i),
//             animProgress: replay.portal_anim_progress(i, partialFrame),
//         };
//         if (oldPortal && equals(oldPortal, newPortal)) {
//             newPortals.push(oldPortal);
//         } else {
//             newPortals.push(newPortal);
//         }
//     }
//     setPortals(newPortals);
// }

export function Portals(props: { portals: Accessor<PortalData[]>, showMode: boolean }) {
    return <Index each={props.portals()}>
        {portal => <Portal portal={portal} showMode={props.showMode} />}
    </Index>;
}

export function Portal(props: { portal: Accessor<PortalData>, showMode: boolean }) {
    return <g transform={transform(props.portal)}>
        <rect x="0" y="-12" width="12" height="24" fill="url(#portal-gradient)" />
        <Show when={props.showMode}>
            <line x1="6" y1="-10" x2="6" y2="-6" class="door-switch-line" />
            <line x1="6" y1="6" x2="6" y2="10" class="door-switch-line" />
            <line x1="4" y1={props.portal().mode ? 8 : -8} x2="8" y2={props.portal().mode ? 8 : -8} class="door-switch-line" />
        </Show>
    </g>;
}

export function PortalDefs() {
    return <linearGradient id="portal-gradient">
        <stop stop-color="var(--open-exit-lower)" offset="0%" />
        <stop stop-color="var(--background)" offset="100%" />
    </linearGradient>;
}
