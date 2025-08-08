<script setup lang="ts">
// import { ref, watch } from 'vue'
// import { useVModel } from '@vueuse/core'

const props = defineProps({
    sizes: { type: Array as () => Array<number>, default: () => [1, 5, 10, 15, 20, 30, 50, 100] },
    total: { type: Number, default: () => 0 },
    size: { type: Number, default: () => 10 },
    no: { type: Number, default: () => 1 },
    showSizePicker: { type: Boolean, default: () => true },
})

const emit = defineEmits(['change', 'update:size', 'update:no'])

// const pageTotal = useVModel(props, 'total', emit)
const pageSize = defineModel('size', { type: Number, default: 10 }) as any
const pageNo = defineModel('no', { type: Number, default: 1 }) as any
</script>

<template>
    <!-- element ui layout -->
    <!-- layout="total, sizes, prev, pager, next, jumper" -->
    <!-- show-quick-jumper -->
    <n-pagination
        v-bind="$attrs"
        v-model:page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="sizes"
        :item-count="total"
        :show-size-picker="showSizePicker"
    >
        <template #prefix="{ itemCount, startIndex }">共 {{ itemCount }} 项</template>
    </n-pagination>
</template>

<style scoped lang="less">
.n-pagination {
    justify-content: center;
}
</style>
