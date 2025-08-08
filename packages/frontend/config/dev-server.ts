import { ServerOptions } from "vite"

const backend = 'http://127.0.0.1:3000'

const serverOptions: ServerOptions = {
    port: 7000,
    proxy: {
        '/api': {
            target: backend,
            ws: true,
            changeOrigin: true,
            // rewrite: (path: any): string => path.replace(/^\/api/, ''),
        },
    },
}

export default serverOptions
