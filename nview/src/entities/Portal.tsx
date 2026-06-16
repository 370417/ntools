import { Index, Show, type Accessor, type Signal } from "solid-js";
import type { Replay } from "../assets/ntools_rs";

export type PortalData = {
    x: number;
    y: number;
    deg: number;
    mode: number;
};

function transform(floorguard: Accessor<PortalData>): string {
    const { x, y, deg } = floorguard();
    return `translate(${x},${y}) rotate(${deg},0,0)`;
}

export function getPortals([_portals, setPortals]: Signal<PortalData[]>, replay: Replay) {
    const newPortalsLen = replay.portals_len();
    const newPortals: PortalData[] = [];
    for (let i = 0; i < newPortalsLen; i++) {
        if (replay.portal_active(i)) {
            const newPortal1 = {
                x: replay.portal_side1_x(i),
                y: replay.portal_side1_y(i),
                deg: replay.portal_side1_deg(i),
                mode: 0,
            };
            const newPortal2 = {
                x: replay.portal_side2_x(i),
                y: replay.portal_side2_y(i),
                deg: replay.portal_side2_deg(i),
                mode: 0,
            };
            newPortals.push(newPortal1, newPortal2);
        }
    }
    setPortals(newPortals);
}

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
