<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

import { useTitle } from '@vueuse/core'
import { watchEffect } from 'vue'

import { useAppStore } from './store/app-store'

const title = useTitle()
const appStore = useAppStore()

watchEffect(() => {
    const titleParts = [
        appStore.title,
        appStore.subTitle,
        appStore.heading,
        appStore.subHeading,
    ].filter((it) => it)
    title.value = titleParts.join(' - ')
})
</script>

<template>
    <router-view />
</template>

<style>
#app {
    display: flex;
    width: 100%;

    /* height: calc(100% - 2rem); */
    height: 100%;
    flex-direction: column;
    padding: 0;
    margin: 0;

    /* text-align: center; */
    color: #2c3e50;

    /* font-family: Avenir, Helvetica, Arial, sans-serif; */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
