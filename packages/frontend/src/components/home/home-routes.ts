import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        name: 'Home',
        path: '/home',
        component: () => import('./home.vue'),
    },
]

export default routes
