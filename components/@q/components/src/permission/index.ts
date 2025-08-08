import Permission from './permission.vue'

const components = {
    install(Vue: any): any {
        Vue.component('CPermission', Permission)
    },
}

export default components
