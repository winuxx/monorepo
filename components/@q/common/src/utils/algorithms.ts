export function mergeExtents(extents: number[][]): number[] | void {
    if (extents.length === 0) return
    return [
        Math.min(...extents.map((it) => it[0])),
        Math.min(...extents.map((it) => it[1])),
        Math.max(...extents.map((it) => it[2])),
        Math.max(...extents.map((it) => it[3])),
    ]
}
