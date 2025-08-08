export function sleep(timeout = 0): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, timeout))
}

export function generateDebounce(defaultWait = 600) {
    let timer
    const debounce = (fn: () => any, wait?: number) => {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(fn, wait ?? defaultWait)
    }
    return debounce
}

export function generateDebounceParallel(defaultWait = 600) {
    const timers = new Map()
    const debounce = (id: any, fn: () => any, wait?: number) => {
        const timer = timers.get(id)
        if (timer) {
            clearTimeout(timer)
            timers.delete(id)
        }
        timers.set(id, setTimeout(fn, wait ?? defaultWait))
    }
    return debounce
}

export function isNumber(str: string): boolean {
    return String(Number(str)) !== String(NaN)
}

export function isDigit(str: string | number | undefined): boolean {
    return Number(str) === parseInt(String(str))
}

export function dateFormat(raw: number | Date, fmt = 'yyyy-mm-dd HH:MM:SS'): string {
    if (!raw) return ''

    const date = new Date(raw || 0)
    let formated = fmt

    const obj: any = {
        'y+': date.getFullYear(),
        'm+': date.getMonth() + 1,
        'd+': date.getDate(),
        'H+': date.getHours(),
        'M+': date.getMinutes(),
        'S+': date.getSeconds(),
    }

    for (const key in obj) {
        const reg = new RegExp(`${key}`)

        if (!reg.test(formated)) continue
        const part = formated.match(reg)?.[0] as string
        // String(obj[key]).padStart(fmt.match(reg)[0].length, "0") // ES2017写法
        const rep =
            String(obj[key]).length === 1 && part.length === 2 ? `0${obj[key]}` : `${obj[key]}`
        formated = formated.replace(part, rep)
    }

    return formated
}

export function convertAcodesToReqParams(acodes: any[]): any {
    const params: any = {}
    try {
        params.cityCode = acodes[0]
        params.districtCode = acodes[1]
        params.streetCode = acodes[2]
    } catch (error) {}
    return params
}

// 获取运行模式
export function getMode(): string {
    return import.meta.env.MODE
}

// 是否为开发环境
export function isDev(): boolean {
    return import.meta.env.DEV
}

// 是否为生产环境
export function isProd(): boolean {
    return import.meta.env.PROD
}
