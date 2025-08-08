import { App } from 'vue'

import Icon from './icon'
import Permission from './permission'

const components = {
    install(app: App): any {
        app.component('CIcon', Icon)
        app.component('CPermission', Permission)
    },
}

export default components
