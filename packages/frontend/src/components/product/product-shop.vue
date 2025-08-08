<script setup lang="ts">
import { Product } from '@packages/backend/src/modules/product'

import { getProducts } from './product-api'

const emit = defineEmits<{
    add: [product: Product]
}>()

const data = defineModel<Product[]>('data', { default: [] })

const loading = ref(false)
const filter = ref({
    visible: true,
    name: '',
})
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

async function onAdd(row) {
    emit('add', row)
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
            <el-input
                v-model="filter.name"
                placeholder="search"
                clearable
                @input="getData"
            ></el-input>
        </header>
        <el-table v-loading="loading" :data="data" row-key="id" table-layout="auto">
            <el-table-column label="Product name" prop="name"> </el-table-column>
            <el-table-column label="Price" prop="price"> </el-table-column>
            <el-table-column label="Add">
                <template #default="{ row }">
                    <el-button type="primary" text @click="onAdd(row)">
                        <el-icon size="large"> <i-ion:cart /></el-icon>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<style lang="less" scoped>
.products {
    .filters {
        margin-bottom: 1rem;
    }
}
</style>
