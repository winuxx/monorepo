<script setup lang="ts">
import { useEventBus } from '@vueuse/core'
import { useMessage } from 'naive-ui'
import { onUnmounted } from 'vue'

import { objectMerge } from '@q/common/src/utils/std-lib-extensions/object'

type success = 'success'
type error = 'error'

interface Options {
    closable?: boolean
    duration?: number
}

interface Msg {
    type: success | error
    title?: string
    msg?: any
    options?: Options
}

const defaultOptions: Options = {
    closable: true,
    duration: 5000,
}

const message: any = useMessage()

const bus = useEventBus<Record<string, any>>('message')

const listener: any = (event: Msg) => {
    if (!event?.type) return
    const msg = () => {
        if (event.title && event.msg) return event.title + ': ' + event.msg
        if (event.title && !event.msg) return event.title
        if (!event.title && event.msg) return event.msg
        return ''
    }
    message[event.type](msg, objectMerge(defaultOptions, event.options))
}

bus.on(listener)

onUnmounted(() => bus.off(listener))
</script>

<template>
    <div></div>
</template>
