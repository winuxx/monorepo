<script setup lang="ts">
import useEnumOptions from './enum-options'

const props = defineProps({
    options: {
        type: Object,
        required: true,
    },
    // value: {
    //     type: [Number, String],
    //     default: () => null,
    // },
})

const emit = defineEmits(['change', 'update:value'])

const selected = defineModel('value', {
    type: [Number, String],
    default: () => null,
}) as any

const _options = useEnumOptions(props.options)

function onChange(val: number) {
    emit('change', val)
}
</script>

<template>
    <n-select
        v-model:value="selected"
        v-bind="$attrs"
        :options="_options"
        @update:value="onChange"
    />
</template>

<style scoped lang="less"></style>
