<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = defineProps({
    options: {
        type: Object,
        required: true,
    },
    value: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits(['change', 'update:value'])

const selected = useVModel(props, 'value', emit) as any

function onChange(val: number[]) {
    emit('change', val)
}
</script>

<template>
    <n-checkbox-group v-model:value="selected" v-bind="$attrs" @update:value="onChange">
        <template v-for="it in options" :key="it">
            <n-checkbox v-if="typeof it === 'number'" :value="it" :label="options[it]" />
        </template>
    </n-checkbox-group>
</template>

<style scoped lang="less"></style>
