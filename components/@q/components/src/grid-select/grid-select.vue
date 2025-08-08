<script setup>
import { useVModel } from '@vueuse/core'
import { ref, computed } from 'vue'

import GridSelectOptions from './grid-select-options.vue'

const props = defineProps({
    value: { type: String, default: () => '' },
    data: { type: Array, default: () => [] },
    labelField: { type: String, default: () => 'label' },
    valueField: { type: String, default: () => 'value' },
    icon: { type: null, default: () => null },
    iconized: { type: Boolean, default: () => false },
    popWidth: { type: Number, default: () => null },
    maxPopWidth: { type: Number, default: () => null },
    maxPopHeight: { type: Number, default: () => null },
    size: { type: String, default: () => 'medium' },
})

const selected = useVModel(props, 'value')
const selectedLabel = computed(
    () => props.data.find((it) => it[props.valueField] === selected.value)?.[props.labelField]
)

const showPopover = ref(false) // set to true for debug

function onItemClick(item) {
    showPopover.value = false
}
</script>

<template>
    <div class="grid-select">
        <n-popover
            v-bind="$attrs"
            v-model:show="showPopover"
            trigger="hover"
            :delay="200"
            :duration="500"
            :width="popWidth"
            :flip="true"
            scrollable
        >
            <template #trigger>
                <template v-if="iconized">
                    <div class="grid-select-trigger-icon">
                        <slot name="icon">
                            <n-icon>
                                <i-ion:grid-outline />
                            </n-icon>
                        </slot>
                    </div>
                </template>
                <template v-else>
                    <n-button class="grid-select-trigger" :size="size" icon-placement="right">
                        <span class="left-icon">
                            <slot name="icon"></slot>
                        </span>
                        <template #icon>
                            <n-icon>
                                <i-ion:grid-outline />
                            </n-icon>
                        </template>
                        {{ selectedLabel }}
                    </n-button>
                </template>
            </template>
            <GridSelectOptions
                v-model:value="selected"
                :data="data"
                :label-field="labelField"
                :value-field="valueField"
                @item-click="onItemClick"
            >
                <template v-for="(val, key) in $slots" #[key]="slotProps" :key="key">
                    <slot :name="key" v-bind="slotProps"></slot>
                </template>
            </GridSelectOptions>
        </n-popover>
    </div>
</template>

<style lang="less" scoped>
.grid-select {
    // width: 100%;
    // margin-bottom: 1rem;

    .grid-select-trigger {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
    }

    .grid-select-trigger-icon {
        display: flex;
        width: 1em;
        height: 1em;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    ::v-deep(.n-button) {
        .n-button__content {
            // display: inline;
            display: flex;
            // justify-content: space-between;
            // width: 100%;
            overflow: hidden;
            align-items: center;
            text-overflow: ellipsis;

            .left-icon {
                max-height: 1em;
                padding: 0;
                margin: 0;

                & > * {
                    width: 1em;
                    height: 1em;
                    margin-top: 0;
                    margin-right: 0.5em;
                    font-size: 1em;
                }
            }
        }

        .n-button__icon {
            width: 1em;
            height: 1em;
            font-size: 1em;
        }
    }
}
</style>
