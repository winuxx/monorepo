<script setup>
import { useVModel } from '@vueuse/core'
import { computed } from 'vue'

const props = defineProps({
    value: { type: String, default: () => '' },
    data: { type: Array, default: () => [] },
    labelField: { type: String, default: () => 'label' },
    valueField: { type: String, default: () => 'value' },
    maxPopWidth: { type: Number, default: () => null },
    maxPopHeight: { type: Number, default: () => null },
    maxColumnCount: { type: Number, default: () => null },
    size: { type: String, default: () => 'medium' },
})

const selected = useVModel(props, 'value')
const emit = defineEmits(['item-click'])

function onItemClick(item) {
    selected.value = item[props.valueField]
    emit('item-click', item)
}

function isActived(item) {
    return item[props.valueField] === selected.value
}

const columnCount = computed(() => {
    const count = parseInt(Math.sqrt(props.data?.length)) || 1
    return props.maxColumnCount ? Math.min(props.maxColumnCount, count) : count
})
// const columnCount = computed(() => {
//     // 避免极限情况 - 过长的楼栋名导致横竖比例不和谐
//     const sqrt = parseInt(Math.sqrt(props.data?.length)) || 1
//     if (sqrt <= 3) return sqrt
//     else return sqrt - 1
// })
// const rootStyleObj = computed(() => ({
//     '--column-count': columnCount.value,
//     // '--max-pop-width': props.maxPopWidth,
// }))
const scrollbarStyle = computed(() => ({
    'max-width': props.maxPopWidth ? maxPopWidth + 'px' : '',
    'max-height': props.maxPopHeight ? props.maxPopHeight + 'px' : '',
}))
const containerWidth = computed(() => {
    return props.maxColumnCount === 1 ? '100%' : 'max-content'
})
</script>

<template>
    <n-scrollbar x-scrollable :style="scrollbarStyle">
        <div class="grid-select-container">
            <div class="grid-select-list">
                <template v-for="item of data" :key="item[valueField]">
                    <div
                        class="grid-select-item"
                        :title="item[labelField]"
                        @click="onItemClick(item)"
                    >
                        <n-tag :type="isActived(item) ? 'info' : 'default'" :size="size">
                            <span class="flex">
                                <span class="left-icon">
                                    <slot name="icon">
                                        <n-icon>●</n-icon>
                                    </slot>
                                </span>
                                {{ item[labelField] }}
                            </span>
                        </n-tag>
                    </div>
                </template>
            </div>
        </div>
    </n-scrollbar>
</template>

<style lang="less" scoped>
.grid-select-container {
    // max-width: calc(100vw - 5.3rem);
    // max-height: calc(100vw - 11rem);
    /* stylelint-disable-next-line value-keyword-case */
    width: v-bind(containerWidth);
    margin: 0.25rem 0;
    // overflow: auto;

    .grid-select-list {
        display: grid;
        /* stylelint-disable-next-line value-keyword-case */
        width: v-bind(containerWidth);
        align-items: center;
        justify-content: center;
        grid-gap: 12px;
        /* stylelint-disable-next-line value-keyword-case */
        grid-template-columns: repeat(v-bind(columnCount), 1fr);

        .grid-select-item {
            cursor: pointer;

            & * {
                pointer-events: none;
            }

            .n-tag {
                width: 100%;
            }

            .left-icon {
                margin-right: 0.25rem;
            }
        }

        .grid-select-item:hover {
            .n-tag {
                color: #39f;
            }
        }
    }
}
</style>
