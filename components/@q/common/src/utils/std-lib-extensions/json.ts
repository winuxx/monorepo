export function jsonDiff2PatchExt(orig: any, dist: any, patch: any): any {
    for (const key in orig) {
        if (!Object.keys(dist).includes(key)) {
            patch[key] = null
        }
    }
    for (const key in dist) {
        if (!Object.keys(orig).includes(key)) {
            patch[key] = dist[key]
        } else {
            const result = jsonDiff2Patch(orig[key], dist[key])
            if (result !== undefined) {
                patch[key] = result
            }
        }
    }
    return patch
}

// todo: 增强对list的适配
 
export function jsonDiff2Patch(orig: any, dist: any): any {
    if (
        (orig instanceof Array && dist instanceof Array) ||
        (orig instanceof Object &&
            dist instanceof Object &&
            !(orig instanceof Array) &&
            !(dist instanceof Array))
    ) {
        let patch: any // any[] | Record<any, any>
        if (orig instanceof Array && dist instanceof Array) {
            patch = []
        } else {
            patch = {}
        }
        for (const key in orig) {
            if (!Object.keys(dist).includes(key)) {
                patch[key] = null
            }
        }
        for (const key in dist) {
            if (!Object.keys(orig).includes(key)) {
                patch[key] = dist[key]
            } else {
                const result = jsonDiff2Patch(orig[key], dist[key])
                if (result !== undefined) {
                    patch[key] = result
                }
            }
        }
        return patch
    } else {
        if (dist === undefined) {
            return null
        } else if (orig !== dist) {
            return dist
        } else {
            return undefined
        }
    }
}

 
export function jsonDiff2Delta<T>(orig: T, dist: T): T | null {
    const delta = null
    return delta
}
