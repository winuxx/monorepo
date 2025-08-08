<script setup lang="ts">
import { ref, onMounted, useAttrs, useSlots } from 'vue'

const attrs = useAttrs()
const slots = useSlots()

const columnsW = ref([] as any)

function addCtrls() {
    if (!slots.ctrls) return
    columnsW.value = attrs.columns
    columnsW.value.push({
        title: '操作',
        // key: 'actions',
        render(row: any) {
            if (!slots.ctrls) return
            return slots.ctrls(row)
        },
    })
}

onMounted(() => {
    // console.log('slots', slots)
    // console.log('columns', columns.value)
    // console.log('attrs', attrs.value)
    addCtrls()
})
</script>

<template>
    <!-- <n-data-table
        ref="table"
        :row-key="row => row.id"
        :checked-row-keys="checkedKeys"
        :columns="columns"
        :data="productList"
        striped
        max-height="100%"
    >
    </n-data-table>-->

    <n-data-table v-bind="$attrs" :columns="columnsW"></n-data-table>

    <div v-show="false">
        <slot name="ctrls"></slot>
    </div>
</template>

<style scoped lang="less"></style>
