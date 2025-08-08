<script setup lang="ts">
import { useEventBus } from '@vueuse/core'
import { useLoadingBar } from 'naive-ui'
import { onMounted, onUnmounted } from 'vue'

import { objectMerge } from '@q/common/src/utils/std-lib-extensions/object'

type start = 'start'
type finish = 'finish'
type error = 'error'

interface Options {
    duration?: number
}

interface Event_ {
    type: start | finish | error
    options?: Options
}

const defaultOptions: Options = {
    duration: 5000,
}

const loading: any = useLoadingBar()

const bus = useEventBus<Record<string, any>>('loading')

let timer: any = null

const listener: any = (event: Event_) => {
    // console.log(JSON.stringify(event, null, 2))
    if (!event?.type) return
    const options = objectMerge(defaultOptions, event.options)
    loading[event.type]()
    if (timer) clearTimeout(timer)
    if (event.type === 'start') {
        timer = setTimeout(() => {
            loading.error()
        }, options.duration)
    }
}

onMounted(() => bus.on(listener))

onUnmounted(() => bus.off(listener))
</script>

<template>
    <div></div>
</template>

<style scoped lang="less"></style>
