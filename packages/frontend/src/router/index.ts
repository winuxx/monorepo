import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'

import config from '~/config'

import routes from './routes'


const routerConfig = config.router

const base = (routerConfig && routerConfig.base) || '.'
const isHistoryMode = routerConfig && routerConfig.mode === 'history'
const routerHistory = isHistoryMode ? createWebHistory(base) : createWebHashHistory(base)

const router = createRouter({
    history: routerHistory,
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) return savedPosition // 前进后退时滚动到之前位置
        if (isHistoryMode && to.hash) return { el: to.hash } // 滚动到锚点 // todo: 兼容
    },
})

export default router
