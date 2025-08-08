<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = defineProps({
    options: {
        type: Object,
        required: true,
    },
    value: {
        type: [Number, String],
        default: () => null,
    },
})

const emit = defineEmits(['change', 'update:value'])

const selected = useVModel(props, 'value', emit)

function onChange(val: number) {
    emit('change', val)
}
</script>

<template>
    <n-radio-group v-model:value="selected" v-bind="$attrs" @update:value="onChange">
        <template v-for="it in options" :key="it">
            <n-radio v-if="typeof it === 'number'" :value="it">{{ options[it] }}</n-radio>
        </template>
    </n-radio-group>
</template>

<style scoped lang="less"></style>
