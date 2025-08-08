import { useEventBus } from '@vueuse/core'

interface MessageEmitFunction {
    (arg0: string): void
}

export interface MessageEmit {
    info: MessageEmitFunction
    warning: MessageEmitFunction
    error: MessageEmitFunction
    success: MessageEmitFunction
    loading: MessageEmitFunction
}

function useNMessage() {
    const messageBus = useEventBus('message')
    const emit = (type: string, title: string, msg?: string) => {
        messageBus.emit({
            type,
            title,
            msg,
        })
    }
    return {
        info: (title: string, msg?: string) => emit('info', title, msg),
        warning: (title: string, msg?: string) => emit('warning', title, msg),
        error: (title: string, msg?: string) => emit('error', title, msg),
        success: (title: string, msg?: string) => emit('success', title, msg),
        loading: (title: string, msg?: string) => emit('loading ', title, msg),
    }
}

export { useNMessage }
