import { Method, ResponseType } from 'axios'
import { stringify } from 'qs'

import HttpRequest from '../lib/axios'

// import store from '../store'
// import router from '../router'
import {
    // getToken,
    getAccessToken,
    getUsername,
    getNickname,
    getACode,
    getUserId,
    getDataRights,
} from './cookie'
import { strip } from './std-lib-extensions/string'
import { parseUrl } from './url-parser'

import config from '@/../config'

const BASE_URL = config.api.base ?? ''
const HEADERS = {
    common: {},
    'X-Requested-With': 'XHR', // note: jQuery 请求会加 'XMLHttpRequest', 故采用不一样的进行区分
    'Content-Type': 'application/json',
}
const TIMEOUT = 10000

export interface ReqBody {
    method: Method
    url: string
    headers?: Record<string, any>
    query?: Record<string, any>
    params?: Record<string, any>
    responseType?: ResponseType
    data?: Record<string, any> | string
    timeout?: number
    needFormat?: boolean
}

const errorTextMap: Record<string | number | symbol, string> = {
    400: '请求无效',
    401: '认证过期或未认证',
    403: '授权过期或未授权',
    404: '找不到接口',
    500: '网络错误、服务器错误或跨域',
    ECONNABORTED: '连接中断',
    ETIMEDOUT: '请求超时',
}
function chooseErrorMessage(errorInfo: any) {
    let errorText = ''
    if (errorTextMap[errorInfo.code]) {
        errorText += errorTextMap[errorInfo.code]
    }
    if (errorInfo.message ?? errorInfo.msg) {
        errorText += ': ' + (errorInfo.message ?? errorInfo.msg)
    }
    if (!errorText) {
        errorText = '请求失败'
    }
    return errorText
}

// notify已移至业务包
// function notify(errorInfo) {
//     // console.debug(errorInfo)
//     // 排除请求失败的后续动作产生的错误
//     if (errorInfo.config && errorInfo.config.url === 'save_error_logger') {
//         return
//     }
//     store.commit('setMessage', {
//         type: 'error',
//         msg: chooseErrorMessage(errorInfo)
//     })
// }

export function wrapFormData(options) {
    const formData = new FormData()
    for (const [key, value] of Object.entries(options)) {
        formData.append(key, value as any)
    }
    return formData
}

export default function (req: ReqBody, conf: any = {}): any {
    // 增加默认请求头
    req.headers = Object.assign({}, HEADERS, req.headers)

    // 判断是否存在token，如果存在将每个请求header都添加token
    // workshop: 排除login请求
    // const accessToken = getToken()
    const accessToken = getAccessToken()
    if (!conf.noToken && accessToken) {
        req.headers.common.accessToken = accessToken
        req.headers.common.access_token = accessToken
        req.headers.common.username = getUsername()
        req.headers.common.nickname = encodeURI(getNickname())
        req.headers.common.userId = getUserId()
        req.headers.common.departmentId = getACode()
        req.headers.common.dataRights = getDataRights()
    }
    // form 格式转换
    if (
        req.headers['Content-Type'] === 'application/x-www-form-urlencoded' &&
        typeof req.data !== 'string'
    ) {
        if (conf.needFormat) {
            req.data = stringify(req.data, { arrayFormat: 'indices', allowDots: true })
        } else {
            req.data = stringify(req.data)
        }
    }

    if (req.headers['Content-Type'] === 'application/json') {
        const data = req.data?.['data'] ?? req.data
        delete data?.logs
    }

    // todo: 移除请求中值为null的参数
    req.url = strip(parseUrl(req.url, { params: req.params, query: req.query }), '/')
    delete req.query
    delete req.params

    // 添加默认(请求/响应?)超时时间
    if (!req.timeout) {
        req.timeout = conf.timeout ?? config?.api?.timeout ?? TIMEOUT
    }

    const httpRequest = new HttpRequest(conf.base ?? BASE_URL)
    return httpRequest
        .request(req)
        .then((res) => {
            if (res.status !== 200) {
                const error = {
                    code: res.status,
                    message: res.statusText,
                }
                throw error
            }

            // 访问受限, 转向登录页面
            // if (res.data.code === 401) {
            //     // todo: 暂不处理
            //     store.commit('setToken', '')
            //     router.replace({
            //         name: 'login'
            //     })
            // }
            // 后端返回失败结果
            if (res.data.success === false) {
                throw res.data
            }
            // 下载静态资源，直接返回结果
            if (
                (res.headers.responseType === 'blob' || res.config.responseType === 'blob') &&
                res.status === 200
            ) {
                return res.data
            }
            // 下载静态资源，包装返回结果
            // if (res.config.responseType === 'blob') {
            //     return {
            //         success: true,
            //         code: res.status,
            //         message: res.statusText,
            //         data: res.data.data,
            //     }
            // }
            // Object.freeze(res.data)
            // Object.freeze(res.data.data)
            return res.data
        })
        .catch((error) => {
            let errorInfo
            if (error.response) {
                errorInfo = {
                    code: error.response.status,
                    message: error.response.statusText,
                    // data: err.response.data,
                }
            } else {
                errorInfo = {
                    ...error,
                }
            }
            errorInfo.message = chooseErrorMessage(errorInfo)
            console.warn(
                'Api request failed:',
                req.method,
                req.url,
                'received',
                errorInfo.code ?? null,
                errorInfo.message
            )
            // notify(errorInfo)
            // addErrorLog(errorInfo)
            return {
                success: false,
                ...errorInfo,
            }
        })
}
