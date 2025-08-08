interface ArrayFilter {
    key: string | number
    value?: any
}

export function arrayReversedCopy<T>(array: T[]): T[] {
    return array.slice().reverse()
}

/**
 * 自然排序 - #字段为空时会排到后面
 * @param array
 * @param field
 * @returns
 */
export function arraySortNaive<T>(array: T[], field: string): T[] {
    return array.sort((a, b) => {
        if (!a[field] && !b[field]) return 0
        else if (!a[field] && b[field]) return 1
        else if (a[field] && !b[field]) return -1
        else
            return a[field].localeCompare(b[field], ['pinpin'], {
                sensitivity: 'base',
                numeric: true,
            })
    })
}

export function arraySortNaiveCopy<T>(array: T[], field: string): T[] {
    return arraySortNaive(array.slice(), field)
}

export function sortArrayWithOrderedIds<T>(array: T[], order: string[], field = '_id'): T[] {
    const map = new Map<string, T>()
    for (const item of array) {
        map.set(item[field], item)
    }
    const sortedList: T[] = []
    for (const id of order) {
        const item = map.get(id)
        if (!item) continue
        sortedList.push(item)
        map.delete(id)
    }
    return [...sortedList, ...map.values()]
}

export function arrayPickToPair<T>(array: T[], filter: ArrayFilter): T[][] {
    const lhs: T[] = []
    const rhs: T[] = []
    for (const it of array) {
        if (it[filter.key] === filter.value) {
            lhs.push(it)
        } else {
            rhs.push(it)
        }
    }
    return [lhs, rhs]
}

export function arrayPickToMap<T>(array: T[], filter: ArrayFilter): Map<string | number, T[]> {
    const map = new Map()
    for (const it of array) {
        const key = it[filter.key]
        if (!map.get(key)) {
            map.set(key, [it])
        } else {
            map.get(key).push(it)
        }
    }
    return map
}

export function arrayRemoveItemsByValue<T>(array: T[], value: T): any[] {
    return array.filter((it: any) => it !== value)
}

export function arrayRemoveItemsByFilter<T>(array: T[], filter: ArrayFilter): any[] {
    return array.filter((it: any) => it[filter.key] !== filter.value)
}

export function arrayRemoveDuplicatesByKey<T>(array: T[], key: string): T[] {
    const used = {}
    return array.filter((it) => {
        if (used[it[key]]) return false
        used[it[key]] = true
        return true
    })
}

export function arraysContainSameItem<T>(arr1: T[], arr2: T[]) {
    for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr2.length; j++) {
            if (arr1[i] === arr2[j]) {
                return true
            }
        }
    }
    return false
}
