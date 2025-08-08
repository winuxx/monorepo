// 资源配置
interface AssetConfig {
    base?: string
    [x: string]: any
}

// API配置
interface ApiConfig {
    timeout?: number
    base?: string
    [x: string]: any
}

// 路由配置
interface RouterConfig {
    mode?: string
    base?: string
    [x: string]: any
}

// 本地服务配置(开发模式)
interface ServerConfig {
    port?: number
    proxy?: string | Record<string, any>
    [x: string]: any
}

export interface Config {
    title?: string
    asset?: AssetConfig
    api?: ApiConfig
    router?: RouterConfig
    server?: ServerConfig
    [x: string]: any
}

const config: Config = {
    /**
     *  配置显示在浏览器标签的title
     */
    title: 'Common',
    /**
     *  token在Cookie中存储的天数，默认1天
     */
    cookieExpires: 7,
    /**
     *  是否使用国际化，默认为false
     *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
     *              用来在菜单中显示文字
     */
    useI18n: true,
    /**
     *  api请求基础路径
     */
    api: {
        timeout: 5000,
        base: '/api',
        imgUrl: '.',
    },
}

export default config
