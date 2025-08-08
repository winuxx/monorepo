import { defineStore } from 'pinia'

import config from '~/config'

import { isDev } from '../utils'


// 第一个参数是应用程序中 store 的唯一 id
export const useAppStore = defineStore('app', {
    state: () => ({
        title: config.title,
        subTitle: '',
        heading: '',
        subHeading: '',
        isDev: isDev(),
        isDark: false, // todo
        isPortrait: false,
        isDdEnv: false,
        goingLogin: false,
    }),
    getters: {
        getTitle: (state) => state.title,
        getSubTitle: (state) => state.subTitle,
        getHeading: (state) => state.heading,
        getSubHeading: (state) => state.subHeading,
        getPortrait: (state) => state.isPortrait,
    },
    actions: {
        setTitle(title) {
            this.title = title
        },
        setSubTitle(subTitle) {
            this.subTitle = subTitle
        },
        setHeading(heading) {
            this.heading = heading
        },
        setSubHeading(subHeading) {
            this.subHeading = subHeading
        },
        setPortrait(isPortrait) {
            this.isPortrait = isPortrait
        },
    },
})
