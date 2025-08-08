import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        name: 'ShopAndCart',
        path: '/shop-n-cart',
        component: () => import('./shop-and-cart.vue'),
    },
]

export default routes
