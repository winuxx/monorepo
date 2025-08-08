import { stringify } from 'qs'

// e.g.: host/url?param=value&param=value
// export function stringifyUrlForQuery(url, options) {
//     let i = 0
//     for (const key in options) {
//       url += (i === 0 ? '?' : '&') + key + '=' + options[key]
//       i += 1
//     }
//     return url
//   }

// e.g.: host/url?param=value&param=value
export function stringifyUrlForQuery(url, options) {
    const str = stringify(options)
    return url + (str ? '?' + stringify(options) : '')
}

// e.g.: host/url/{param}/{param}
export function stringifyUrlWithParams(url, params) {
    for (const key in params) {
        url = url.replace(`{${key}}`, params[key] || '')
    }
    return url
}

interface IUrlParserOptions {
    params?: Record<string, any>
    query?: Record<string, any>
}
export function parseUrl(url: string, { params, query }: IUrlParserOptions) {
    // 将params替换到url
    // 适用写法: url/{param}
    if (params) url = stringifyUrlWithParams(url, params)
    // 将query添加到url
    if (query) url = stringifyUrlForQuery(url, query)
    return url
}
