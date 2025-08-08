const config = {
    title: 'App',
    cookieExpires: 7,
    useI18n: true,
    asset: {
        base: '/app',
    },
    api: {
        timeout: 15000,
        base: '/api',
    },
    router: {
        mode: 'history',
        base: '/app',
    },
}

export default config
