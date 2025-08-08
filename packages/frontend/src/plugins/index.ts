import { App } from 'vue'

import { errorHandler, warnHandler } from './error-handler'

const plugins = {
    install(app: App): any {
        app.config.errorHandler = errorHandler
        app.config.warnHandler = warnHandler
    },
}

export default plugins
