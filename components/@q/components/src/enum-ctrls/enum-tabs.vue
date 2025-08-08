<script setup lang="ts">
import { useVModel } from '@vueuse/core'

import { isNumber } from '@q/common/src/utils'

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
    <el-tabs v-model="selected" class="card-header">
        <template v-for="(item, index) in options" :key="index">
            <el-tab-pane v-if="isNumber(index)" :label="item" :name="index"></el-tab-pane>
        </template>
    </el-tabs>
</template>

<style scopped lang="less"></style>
