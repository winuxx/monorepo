<script setup lang="ts">
import { Product } from '@packages/backend/src/modules/product'

import { ProductShop } from '../product'

import { CartItem } from './cart-if'
import Cart from './cart.vue'

const products = ref<Product[]>([])
const productIdMap = computed(() => {
    const map = {}
    products.value.forEach((item) => {
        map[item.id] = item
    })
    return map
})

const cartItems = ref<CartItem[]>([])
const cartItemIdMap = ref({})

function onAdd(product: Product) {
    if (!Object.hasOwn(cartItemIdMap.value, product.id)) {
        const cartItem = {
            productId: product.id,
            name: product.name,
            price: product.price,
            qty: product.qty,
            quantity: 1,
        }
        cartItems.value.push(cartItem)
        cartItemIdMap.value[product.id] = cartItem
    } else {
        const cartItem = cartItemIdMap.value[product.id]
        if (cartItem.quantity < product.qty) {
            cartItem.quantity += 1
        }
    }
}
</script>

<template>
    <div class="shop-and-cart">
        <ProductShop v-model:data="products" @add="onAdd" />
        <Cart v-model:data="cartItems" />
    </div>
</template>

<style lang="less" scoped>
.shop-and-cart {
    display: flex;
    overflow: hidden;

    .products {
        flex: 1;
    }

    .cart {
        flex: 1;
        margin-left: 1rem;
    }
}
</style>
