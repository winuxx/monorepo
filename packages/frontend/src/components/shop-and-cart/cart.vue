<script setup lang="ts">
import { CartItem } from './cart-if'

const data = defineModel<CartItem[]>('data', {
    default: [],
})

const total = computed(() => {
    return data.value.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
})
</script>

<template>
    <div class="cart">
        <header>
            <h4>Cart</h4>
        </header>
        <el-table :data="data" row-key="productId" table-layout="auto">
            <el-table-column label="Items" prop="name"> </el-table-column>
            <el-table-column label="Price" prop="price"> </el-table-column>
            <el-table-column label="Quantity" prop="quantity">
                <template #default="{ row }">
                    <el-input-number
                        v-model="row.quantity"
                        controls-position="right"
                        :precision="0"
                        :step-strictly="true"
                        :step="1"
                        :min="0"
                        :max="row.qty"
                    >
                    </el-input-number>
                </template>
            </el-table-column>
        </el-table>
        <div class="stat">
            <span>Total: {{ total }}</span>
        </div>
    </div>
</template>

<style lang="less" scoped>
.cart {
    .stat {
        margin-top: 0.5rem;
    }
}
</style>
