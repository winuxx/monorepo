<script setup lang="ts">
import { Product } from '@packages/backend/src/modules/product'

import { addProduct, editProduct, getProducts } from './product-api'

const loading = ref(false)
const filter = ref({
    name: '',
})
const data = ref<Product[]>([])
async function getData() {
    loading.value = true
    const res = await getProducts(filter.value)
    data.value = res.data || []
    data.value.push({
        id: null,
        name: '',
        price: null,
        qty: null,
        visible: true,
    })
    loading.value = false
}

async function onAdd() {
    loading.value = true
    const res = await addProduct(data.value.at(-1))
    if (res.success) {
        await getData()
    }
    loading.value = false
}

async function onEdit(id: number, field: string, value: any) {
    if (!id) {
        return
    }
    loading.value = true
    const res = await editProduct(id, {
        [field]: value,
    })
    if (res.success) {
        await getData()
    }
    loading.value = false
}

onMounted(() => {
    getData()
})
</script>

<template>
    <div class="products">
        <header>
            <h4>Products</h4>
        </header>
        <header class="filters">
            <el-input v-model="filter.name" clearable></el-input>
            <el-button @click="getData">Filter</el-button>
        </header>
        <el-table v-loading="loading" :data="data" row-key="id" table-layout="auto">
            <!-- <el-table-column fixed label="#" type="index" width="50"> </el-table-column> -->
            <el-table-column label="Product name" prop="name" sortable>
                <template #default="{ row }">
                    <template v-if="row.id">
                        {{ row.name }}
                    </template>
                    <template v-else>
                        <el-input v-model="row.name" placeholder="New product name"></el-input>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="Price" prop="price" width="200">
                <template #default="{ row }">
                    <el-input
                        v-model="row.price"
                        @change="onEdit(row.id, 'price', row.price)"
                    ></el-input>
                </template>
            </el-table-column>
            <el-table-column label="Qty" prop="qty" width="200">
                <template #default="{ row }">
                    <el-input-number
                        v-model="row.qty"
                        controls-position="right"
                        :precision="0"
                        :step-strictly="true"
                        :step="1"
                        :min="0"
                        :max="1000000"
                        @change="onEdit(row.id, 'qty', row.qty)"
                    >
                    </el-input-number>
                </template>
            </el-table-column>
            <el-table-column label="Visible" prop="visible" width="120">
                <template #default="{ row }">
                    <template v-if="row.id">
                        <el-switch
                            v-model="row.visible"
                            size="small"
                            @change="onEdit(row.id, 'visible', row.visible)"
                        />
                    </template>
                    <template v-else>
                        <el-button type="primary" @click="onAdd">Add</el-button>
                    </template>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<style lang="less" scoped>
.products {
    .filters {
        margin-bottom: 1rem;
        > :not(:first-child) {
            margin-left: 1rem;
        }
    }
}
</style>
