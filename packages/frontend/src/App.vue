<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

import { useEventBus } from '@vueuse/core'
import { ElConfigProvider } from 'element-plus'
import elementZhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { NConfigProvider, zhCN as naiveZhCn, dateZhCN } from 'naive-ui'

// import { useRem } from '@q/common/src/hooks/use-rem'
import NLoading from '@q/components/src/loading'
import NMessage, { useNMessage } from '@q/components/src/message'

import MainHeader from '@/components/main/main-header.vue'

import { useAppStore } from './store/app-store'
import naiveUiTheme from './styles/naive-ut-theme'

// useRem({ base: { size: 16, width: 1920 }, mode: 'width' })

const appStore = useAppStore()
const route = useRoute()

// const showNav = computed(() => route.name !== 'UserLogin')
// const showSide = computed(() => route.name !== 'UserLogin')
// const collapseSide = ref(false)

watchEffect(() => {
    const titleParts = [
        route.name,
        appStore.title,
        appStore.subTitle,
        appStore.heading,
        appStore.subHeading,
    ].filter((it) => it)
    document.title = titleParts.join(' - ')
})
const ready = ref(false)
onBeforeMount(async () => {
    ready.value = true
})

provide('message', useNMessage())
provide('loading', useEventBus('loading').emit)
</script>

<template>
    <n-config-provider
        :locale="naiveZhCn"
        :date-locale="dateZhCN"
        :theme-overrides="naiveUiTheme"
        inline-theme-disabled
    >
        <el-config-provider :locale="elementZhCn">
            <div class="main-container">
                <header class="main-header">
                    <MainHeader />
                </header>
                <main id="scroll-container" class="main-scroll">
                    <div class="main-content">
                        <router-view v-if="ready" />
                    </div>
                </main>
                <footer class="main-footer">
                    <span class="corp">copyright:</span>
                </footer>
            </div>
        </el-config-provider>
        <n-message-provider>
            <NMessage />
        </n-message-provider>
        <n-loading-bar-provider>
            <NLoading />
        </n-loading-bar-provider>
    </n-config-provider>
</template>

<style>
#app {
    display: flex;
    width: 100%;

    height: 100%;
    flex-direction: column;
    padding: 0;
    margin: 0;

    color: #2c3e50;

    /* font-family: Avenir, Helvetica, Arial, sans-serif; */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>

<style scoped lang="less">
.n-config-provider {
    width: 100%;
    height: 100%;
}

.main-container {
    display: flex;
    overflow: hidden;
    width: 100%;
    height: 100%;
    flex-direction: column;
    font-weight: r;
}

.main-header {
    z-index: 999;
    display: flex;
    height: auto;
    align-content: space-between;
    padding: 0 1rem;
    border-bottom: 1px solid #e8e8e8;
    background: #f6f8fd;
    // box-shadow: 2px 2px 8px 0 rgba(182, 192, 219, 0.06), 4px 4px 16px 0 rgba(182, 189, 208, 0.04);
    // box-shadow: 0.125rem 0.125rem 0.5rem 0 #0001, 0.25rem 0.25rem 1rem 0 #fff2;
}

.main-section {
    display: flex;
    overflow: hidden;
    width: 100%;
    height: 100%;
    color: #333;
}

.main-side {
    width: 240px;
    background: #f6f8fd;
}

.main-scroll {
    display: flex;
    overflow: auto; //过时, 但edge支持
    height: 100%;
    align-items: flex-start;
}

.main-content {
    padding: 1rem;
    display: flex;
    overflow: hidden;
    width: max-content;
    flex: 1;
    flex-direction: column;
    margin: 0 auto;
}

.main-footer {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1rem;
    margin: 0;
    font-size: 12px;
    line-height: 1rem;
    text-align: center;

    .corp {
        margin: 0 1rem;
    }
}
</style>
