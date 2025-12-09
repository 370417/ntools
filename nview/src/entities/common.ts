export function transform({ x, y, deg }: { x: number, y: number, deg: number }): string {
    return `translate(${x},${y}) rotate(${deg},0,0)`;
}
