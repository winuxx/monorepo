<template>
    <component :is="componentsMap[type]" :name="name" :style="styleObj" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { isNumber } from '@q/common/src/utils'

import IconFont from './icon-font.vue'
import IconSvg from './icon-svg.vue'

const props = defineProps({
    type: { type: String, default: 'svg' },
    name: { type: String, default: '' },
    color: { type: String, default: '' }, // svg symbol path 中自带颜色时此参数无效
    size: { type: String, default: '1em' },
})

const componentsMap: Record<string, any> = {
    svg: IconSvg,
    font: IconFont,
}

const styleObj = computed(() => {
    return {
        color: props.color,
        'font-size': isNumber(props.size as string) ? props.size + 'px' : props.size,
    }
})

// function getType() {
// }
</script>

<style lang="less"></style>
