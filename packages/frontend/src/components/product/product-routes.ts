import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        name: 'Product',
        path: '/product',
        component: () => import('./product.vue'),
    },
]

export default routes
