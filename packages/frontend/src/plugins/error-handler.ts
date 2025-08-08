import { AppConfig } from 'vue'

export const errorHandler: AppConfig['errorHandler'] = (err: string, vm, info) => {
    console.error(`${err}\n${info}`)
}

export const warnHandler: AppConfig['warnHandler'] = (msg: string, vm, trace) => {
    // console.warn(`${msg}\n${trace}`)
    console.groupCollapsed('👻', `${msg} ${trace.split('\n')[0]}`)
    console.warn(trace)
    console.groupEnd()
}
