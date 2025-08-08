<script setup lang="ts">
import { useVModel } from '@vueuse/core'

import ESign from './e-sign.vue'

const props = defineProps({
    show: { type: Boolean, default: () => false },
})

const emit = defineEmits(['cancel', 'confirm'])

const showRef = useVModel(props, 'show')

function onCancel() {
    emit('cancel')
}

function onConfirm(file) {
    emit('confirm', file)
}
</script>

<template>
    <div class="e-sign-waper">
        <n-modal v-model:show="showRef" preset="card" title="签名">
            <ESign v-if="showRef" @cancel="onCancel" @confirm="onConfirm" />
        </n-modal>
    </div>
</template>

<style lang="less" scoped>
.e-sign-waper {
    display: flex;
    flex: 1;
    flex-direction: column;
}
</style>
