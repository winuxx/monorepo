<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { TreeOption, TreeDropInfo } from 'naive-ui'
import { TreeRenderProps } from 'naive-ui/es/tree/src/interface'
import { ref, watch, useSlots, VNodeChild } from 'vue'
// import { convertTreeToList } from '@q/common/src/utils/tree'

// note:
// 扩展一个节点单选值
// 只能选中叶节点
// todo: 扩展默认展开项 - 节点需要设置 parentId - 需要递归往上查找 - 需要扁平化 list

const props = defineProps({
    selected: { type: String, default: () => '' },
    checked: { type: Array, default: () => [] },
    data: { type: null, default: () => [] }, // type: TreeOption[]
    labelField: { type: String, default: () => 'label' },
    keyField: { type: String, default: () => 'value' },
    childrenField: { type: String, default: () => 'children' },
    anyNodeCheckable: { type: Boolean, default: false },
    searchable: { type: Boolean, default: () => false },
})

const emit = defineEmits([
    'filter-update',
    // 在popover中，当trigger='hover'时，在输入法（中文）打字时会丢失焦点，导致弹框自动隐藏
    // 故将'compositionstart', 'compositionend'事件传递至父组件，父组件在打字时修改trigger为'click'
    'compositionstart',
    'compositionend',
])

// const list = computed(() => convertTreeToList(props.data, { children: props.childrenField }))

const selectedRef = defineModel('selected', { type: String, default: '' })
const checkedRef = defineModel('checked', { type: Array, default: [] }) as any
const dataRef = defineModel('data', { type: null, default: [] }) as any

function onUpdateSelectedkeys(keys: string[], options: any[], meta: any) {
    if (keys.length === 0) return
    // 判断是否叶节点
    if (!props.anyNodeCheckable && options[0]?.[props.childrenField]) {
        selectedKeys.value = [selectedRef.value]
    } else {
        selectedRef.value = keys?.[0]
    }
}

// const selectedKeysRef = useVModel(props, 'selectedKeys')
const selectedKeys = ref<string[]>([])
watch(
    selectedRef,
    (val) => {
        if (val && val !== selectedKeys.value?.[0]) {
            selectedKeys.value = [val]
        }
    },
    { immediate: true }
)
// watchEffect(() => {
//     if (props.selected && props.selected !== selectedKeys.value?.[0]) {
//         selectedKeys.value = [props.selected]
//         // const label = list.value.find((it) => it[props.keyField] === props.selected)?.[
//         //     props.labelField
//         // ]
//         // emit('label-update', label)
//     }
// })

// const selectedLabel = computed(
//     () => list.value.find((it) => it[props.keyField] === selectedRef.value)?.[props.labelField]
// )
// const selectedLabelRef = useVModel(props, 'selectedLabel')
// watchEffect(() => {
//     selectedLabelRef.value = list.value.find((it) => it[props.keyField] === selectedRef.value)?.[
//         props.labelField
//     ]
// })

interface Info extends TreeRenderProps {
    option: any
    selected: boolean
    checked: boolean
}
const slots = useSlots()
function renderPrefix(info: TreeRenderProps): any {
    if (!slots.prefix) return
    return slots.prefix(info)
}
function renderLabel(info: TreeRenderProps): any {
    // return为空时, 显示空白
    if (!slots.label) return info.option?.[props.labelField || 'label']
    return slots.label(info)
}
function renderSuffix(info: TreeRenderProps): any {
    if (!slots.suffix) return
    return slots.suffix(info)
}

const keyword = ref('')
watch(keyword, (val) => {
    emit('filter-update', val)
})
function filter(pattern: string, node: TreeOption): boolean {
    const available = (node[props.labelField] as string)?.includes(pattern)
    node.checkable = available
    return available
}

function findSiblingsAndIndex(
    node: TreeOption,
    nodes?: TreeOption[]
): [TreeOption[], number] | [null, null] {
    if (!nodes) return [null, null]
    for (let i = 0; i < nodes.length; ++i) {
        const siblingNode = nodes[i]
        if (siblingNode[props.keyField] === node[props.keyField]) return [nodes, i]
        const [siblings, index] = findSiblingsAndIndex(
            node,
            siblingNode[props.childrenField] as TreeOption[]
        )
        if (siblings && index != null) return [siblings, index]
    }
    return [null, null]
}

function onDrop({ node, dragNode, dropPosition }) {
    const [dragNodeSiblings, dragNodeIndex] = findSiblingsAndIndex(dragNode, dataRef.value)
    if (dragNodeSiblings == null || dragNodeIndex == null) return
    dragNodeSiblings.splice(dragNodeIndex, 1)
    if (dropPosition === 'inside') {
        if (node[props.childrenField]) {
            node[props.childrenField].unshift(dragNode)
        } else {
            node[props.childrenField] = [dragNode]
        }
    } else if (dropPosition === 'before') {
        const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(node, dataRef.value)
        if (nodeSiblings == null || nodeIndex == null) return
        nodeSiblings.splice(nodeIndex, 0, dragNode)
    } else if (dropPosition === 'after') {
        const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(node, dataRef.value)
        if (nodeSiblings == null || nodeIndex == null) return
        nodeSiblings.splice(nodeIndex + 1, 0, dragNode)
    }
    dataRef.value = Array.from(dataRef.value)
}

function onCompositionstart(e) {
    emit('compositionstart')
}
function onCompositionend(e) {
    emit('compositionend')
}
</script>

<template>
    <n-input
        v-if="searchable"
        v-model:value="keyword"
        placeholder="请输入关键字搜索"
        clearable
        @compositionstart="onCompositionstart"
        @compositionend="onCompositionend"
    ></n-input>
    <n-tree
        v-bind="$attrs"
        v-model:checked-keys="checkedRef"
        :pattern="keyword"
        :filter="filter"
        :show-irrelevant-nodes="false"
        :selected-keys="selectedKeys"
        :key-field="keyField"
        :label-field="labelField"
        :children-field="childrenField"
        :data="dataRef"
        :render-prefix="renderPrefix"
        :render-label="renderLabel"
        :render-suffix="renderSuffix"
        block-node
        @update:selected-keys="onUpdateSelectedkeys"
        @drop="onDrop"
    >
        <slot name="prefix"></slot>
        <slot name="label"></slot>
        <slot name="suffix"></slot>
    </n-tree>
</template>

<style scoped lang="less">
.n-input {
    margin-bottom: 0.5rem;
}

.n-tree {
    ::v-deep(.n-tree-node-content) {
        .n-tree-node-content__suffix {
            align-items: center;
        }
    }
}
</style>
