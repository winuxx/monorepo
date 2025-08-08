import { RouteRecordRaw } from 'vue-router'

import { homeRoutes } from '@/components/home'
import { productRoutes } from '@/components/product'
import { shopAndCartRoutes } from '@/components/shop-and-cart'

const routes: Array<RouteRecordRaw> = [
    {
        name: 'Root',
        path: '/',
        redirect: '/home',
        children: [...homeRoutes, ...productRoutes, ...shopAndCartRoutes],
    },

]

export default routes
