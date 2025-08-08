import Icon from './icon.vue'

const components = {
    install(Vue: any): any {
        Vue.component('CIcon', Icon)
    },
}

export default components
