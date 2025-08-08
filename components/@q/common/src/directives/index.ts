import { App } from 'vue'

import * as list from './directives'

// 注册全局指令
const directives = {
    install(app: App): any {
        Object.keys(list).forEach((key) => {
            app.directive(key, list[key])
        })
    },
}

export default directives
