import './styles/index.less'
import { createApp } from 'vue'

// import components from '@q/components/src'

import App from './App.vue'
import directives from './directives'
import plugins from './plugins'
import router from './router'
import store from './store'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(plugins)
app.use(directives)
// app.use(components)
app.mount('#app')


export default app
