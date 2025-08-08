import { resolve as pathResolve } from 'node:path'

import basicSsl from '@vitejs/plugin-basic-ssl'
// import legacyPlugin from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import {
    // VueUseComponentsResolver,
    AntDesignVueResolver,
    NaiveUiResolver,
    ElementPlusResolver,
    VantResolver,
} from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, PluginOption, UserConfigExport } from 'vite'
// import checker from 'vite-plugin-checker'
import eslintPlugin from 'vite-plugin-eslint'
// import oxlintPlugin from 'vite-plugin-oxlint'
// import styleImport from 'vite-plugin-style-import'
import vueDevTools from 'vite-plugin-vue-devtools'
import pkgConfig from './config'
import devServer from './config/dev-server'


console.log('pkg config:', pkgConfig)

const alias: Record<string, string> = {
    '~/': pathResolve('./') + '/',
    '@/': pathResolve('./src/') + '/',
}
console.log('alias:', alias)

const baseConfig: UserConfigExport = {
    base: pkgConfig?.asset?.base ?? './',
    publicDir: `./public`,
    plugins: [
        vueDevTools(),
        vue({
            script: {
                defineModel: true,
            },
        }),
        ...(devServer?.https ? [basicSsl()] : []),
        // checker({
        //     // e.g. use TypeScript check
        //     // typescript: true,
        //     vueTsc: true,
        // }),
        // oxlintPlugin({
        //     path: `./src`,
        //     // allow: ['no-empty-file'],
        //     // params: '-c oxlintrc.json',
        // }),
        eslintPlugin({
            failOnWarning: false,
            failOnError: false,
        }),
        AutoImport({
            imports: ['vue', 'vue-router'], // 自动导入vue和vue-router相关函数
            dts: `./auto-import.d.ts`, // true, // "src/auto-import.d.ts" // 生成 `auto-import.d.ts` 全局声明
        }),
        Components({
            resolvers: [
                // VueUseComponentsResolver(),
                NaiveUiResolver(),
                AntDesignVueResolver({
                    importStyle: false, // 全局引入，避免覆盖自定义全局样式
                }),
                ElementPlusResolver({
                    importStyle: false, // 全局引入，避免样式逐个引入导致依赖频繁更新
                }),
                VantResolver({
                    importStyle: false, // 全局引入，避免样式逐个引入导致依赖频繁更新
                }),
                // (name) => { // todo
                //     // where `name` is always CapitalCase
                //     if (name.startsWith('c-')) return { importName: name.slice(3), path: 'ionicons' }
                // },
                IconsResolver({
                    // 使用: <{prefix}-{collection}-{icon} />
                    enabledCollections: ['ep', 'ant-design', 'ion', 'mdi'], // ep: element-plus
                }),
            ],
            dts: `./components.d.ts`, // true, // globalComponentsDeclaration
            // filters for transforming targets
            include: [/\.vue$/, /\.vue\?vue/],
            // exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/],
        }),
        Icons({
            // autoInstall: true,
        }),
        // legacyPlugin({
        //     // targets: ['> 1%', 'last 2 versions', 'not dead'], // 需要兼容的目标列表，可以设置多个
        //     additionalLegacyPolyfills: ['regenerator-runtime/runtime'], // 面向IE11时需要此插件
        //     // externalSystemJS: false,
        // }),
        visualizer({
            filename: `dist/stats.html`,
            open: true, // 注意这里要设置为true，否则无效
            gzipSize: true,
            brotliSize: true,
        }) as PluginOption,
    ],
    css: {
        // preprocessorOptions: {
        //     scss: {
        //         additionalData: `@use "@/styles/element/index.scss" as *;`,
        //     },
        // },
    },
    resolve: {
        alias,
        dedupe: [
            'vue',
            'vue-router',
            // '@vueuse/core',
            'element-plus',
            'ant-design-vue',
            'naive-ui',
        ],
    },
    optimizeDeps: {
        include: ['element-plus/es'],
    },
}

function getAddiConfig(mode: string): UserConfigExport {
    switch (mode) {
        case 'development':
            return {
                server: devServer,
            }
        case 'production':
            return {
                logLevel: 'warn',
                build: {
                    outDir: `dist`,
                    //     assetsDir: pkgConfig.asset.base, // 打包生成的静态资源路径, 非public (/)
                    manifest: true,
                    rollupOptions: {
                        output: {
                            // dir: 'dist',
                            manualChunks: {
                                // xlsx: ['xlsx'],
                                // exceljs: ['exceljs'],
                            },
                        },
                    },
                },
            }
        default:
            return {}
    }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const addiConfig = getAddiConfig(mode)
    const config = Object.assign(baseConfig, addiConfig)
    if (mode === 'production') {
        console.log('config:', config)
    }
    return config
})
