<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { ref, computed } from 'vue'

import { convertTreeToList } from '@q/common/src/utils/tree'

import NTreeW from './n-tree-w.vue'

// note:
// 扩展一个节点单选值
// 只能选中叶节点
// todo: 扩展默认展开项 - 节点需要设置 parentId - 需要递归往上查找 - 需要扁平化 list
// searchable - 可用。在popover中，当trigger='hover'时，打字时会丢失焦点，导致弹框自动隐藏

const props = defineProps({
    collapsed: {
        type: Boolean,
        default: () => false,
    },
    popWidth: {
        type: Number,
        default: () => null,
    },
    popTrigger: { type: String, default: () => 'hover' },
    // selected: {
    //     type: String,
    //     default: () => '',
    // },
    // data: {
    //     type: null, // TreeOption[]
    //     default: () => [],
    // },
    labelField: {
        type: String,
        default: () => 'label',
    },
    keyField: {
        type: String,
        default: () => 'value',
    },
    childrenField: {
        type: String,
        default: () => 'children',
    },
    cascade: {
        type: Boolean,
        default: () => false,
    },
    badge: {
        type: [String, Number],
        default: null,
    },
})

const selectedRef = defineModel('selected', { type: String, default: () => '' })
const dataRef = defineModel('data', { type: null, default: () => [] })

const list = computed(() =>
    convertTreeToList(dataRef.value, {
        id: props.keyField,
        parentId: 'parentId',
        children: props.childrenField,
    })
)

function findLabelsCascade(options: any[], key: any, labels: any[] = []) {
    const option = options.find((it) => it[props.keyField] === key)
    if (!option) {
        return []
    }
    if (option['parentId']) {
        findLabelsCascade(options, option['parentId'], labels)
    }
    labels.push(option[props.labelField])
    return labels
}

const selectedLabel = computed(() => {
    if (!props.cascade) {
        return list.value.find((it) => it[props.keyField] === selectedRef.value)?.[props.labelField]
    } else {
        return findLabelsCascade(list.value, selectedRef.value).join(' / ')
    }
})

const popoverTrigger = ref<any>(props.popTrigger)
</script>

<template>
    <template v-if="collapsed">
        <div class="tree-select">
            <n-popover
                :trigger="popoverTrigger"
                :delay="200"
                :duration="500"
                :width="popWidth"
                scrollable
                display-directive="show"
                @compositionstart="() => (popoverTrigger = 'click')"
                @compositionend="() => (popoverTrigger = popTrigger)"
            >
                <template #trigger>
                    <n-button class="tree-select-trigger" icon-placement="right">
                        <span class="left-icon"><slot name="icon"></slot></span>
                        <span class="label">{{ selectedLabel }}</span>
                        <span class="suffix">
                            <template v-if="badge">
                                <span class="badge red">{{ badge }}</span>
                            </template>
                            <template v-else>
                                <n-icon>
                                    <i-ion:list />
                                </n-icon>
                            </template>
                        </span>
                    </n-button>
                </template>
                <!-- todo: height - hardcode -->
                <n-scrollbar style="max-height: 700px">
                    <NTreeW
                        v-bind="$attrs"
                        v-model:selected="selectedRef"
                        v-model:data="dataRef"
                        :key-field="keyField"
                        :label-field="labelField"
                        :children-field="childrenField"
                        :cascade="cascade"
                    >
                        <template v-for="(item, key, index) in $slots" :key="index" #[key]="node">
                            <slot v-bind="node" :name="key"></slot>
                        </template>
                    </NTreeW>
                </n-scrollbar>
            </n-popover>
        </div>
    </template>
    <template v-else>
        <NTreeW
            v-bind="$attrs"
            v-model:selected="selectedRef"
            v-model:data="dataRef"
            :key-field="keyField"
            :label-field="labelField"
            :children-field="childrenField"
            :cascade="cascade"
        >
            <template v-for="(item, key, index) in $slots" :key="index" #[key]="node">
                <slot v-bind="node" :name="key"></slot>
            </template>
        </NTreeW>
    </template>
</template>

<style scoped lang="less">
.tree-select {
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
                    margin-right: 0.5em;
                    font-size: 1em;
                }
            }

            .label {
                text-overflow: ellipsis;
            }
        }

        .n-button__icon {
            width: 1em;
            height: 1em;
            font-size: 1em;
        }

        .n-badge {
            margin-left: 0.5rem;
        }
    }

    .suffix {
        min-width: 1em;
        margin-left: 0.5em;

        .badge {
            border: 1px solid var(--n-node-color-active);
            // border-radius: 1em;
            font-size: 12px;
        }
    }
}
</style>
