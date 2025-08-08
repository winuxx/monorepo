export function objectMerge(...args: any[]): any {
    // note: null, undefined 仍然覆盖
    let src
    let dist
    let merged
    let addi
    switch (args.length) {
        case 0:
            throw new Error("no, you don't need me")
        case 1:
            return args[0]
        case 2:
            ;[src, dist] = args
            if (dist === undefined) {
                return src
            }
            if (
                !(dist instanceof Object) ||
                dist instanceof Array ||
                dist instanceof Function ||
                !(src instanceof Object) ||
                src instanceof Array
            ) {
                return dist
            }
            if (Object.keys(dist).length === 0) {
                return src
            }
            if (Object.keys(src).length === 0) {
                return dist
            }
            merged = { ...src } // 避免改变原对象
            for (const key in dist) {
                merged[key] = objectMerge(src[key], dist[key])
            }
            return merged
        default:
            // 1. 从后往前合
            // ;[src, ...dist] = args
            // dist = objectMerge(dist)
            // 2. 从前往后合
            ;[src, dist, ...addi] = args
            merged = objectMerge(src, dist)
            return objectMerge(merged, ...addi)
    }
}

function applyValueWithNestedFields(item: Record<any, any>, fields: string[], value: any): any {
    if (!(fields instanceof Array)) {
        return
    }
    if (fields.length === 0) {
        return
    }
    const [field, ...others] = fields
    if (others.length === 0) {
        item[field] = value
        return
    }
    if (!item[field]) {
        item[field] = {}
    }
    applyValueWithNestedFields(item[field], others, value)
}

function getValueWithNestedFields(item: Record<any, any>, fields: string[]) {
    if (!(item instanceof Object)) {
        return
    }
    if (fields.length === 0) {
        return
    }
    const [field, ...others] = fields
    if (others.length === 0) {
        return item[field]
    }
    if (!item[field]) {
        return
    }
    return getValueWithNestedFields(item[field], others)
}

/**
 *
 * @param item - {}
 * @param fieldStr - 'a.b.c'
 * @param value
 */
export function objectApplyValueWithNestedFields(
    item: Record<any, any>,
    fieldStr: string,
    value: any
): void {
    const fields = fieldStr.split('.')
    applyValueWithNestedFields(item, fields, value)
}

/**
 *
 * @param item - {a:{b: 1}}
 * @param fieldStr - 'a.b'
 * @returns 1
 */
export function objectGetValueWithNestedFields(item: Record<any, any>, fieldStr: string): any {
    const fields = fieldStr.split('.')
    return getValueWithNestedFields(item, fields)
}
