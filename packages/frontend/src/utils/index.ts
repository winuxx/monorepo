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
