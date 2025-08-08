import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'

import { routes as businessRoutes } from '@/index'

import commonRoutes from './routes'

import config from '@/../config'

const routerConfig = config.router

const base = (routerConfig && routerConfig.base) || '.'
const isHistoryMode = routerConfig && routerConfig.mode === 'history'
const routerHistory = isHistoryMode ? createWebHistory(base) : createWebHashHistory(base)
const routes: Array<RouteRecordRaw> = [...businessRoutes, ...commonRoutes] as Array<RouteRecordRaw>

const router = createRouter({
    history: routerHistory,
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) return savedPosition // 前进后退时滚动到之前位置
        if (isHistoryMode && to.hash) return { el: to.hash } // 滚动到锚点 // todo: 兼容
    },
})

export default router
