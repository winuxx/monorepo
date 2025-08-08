import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

// axios.defaults.withCredentials = true // 自动添加cookies?

interface Options extends AxiosRequestConfig {
    // method: string
    url: string
    [key: string]: any
}

class HttpRequest {
    baseUrl: string
    queue: { [key: string]: number }
    options: Options

    constructor(baseUrl = './') {
        this.baseUrl = baseUrl
        this.options = {
            adapter: 'fetch',
            baseURL: this.baseUrl,
            url: '',
            // method: '',
            transformResponse: [
                (data: string) => {
                    try {
                        // 如果转换成功则返回转换的数据结果
                        return JSON.parse(data)
                    } catch (err) {
                        // 如果转换失败，则包装为统一数据格式并返回
                        return {
                            data,
                        }
                    }
                },
            ],
        }
        this.queue = {}
    }

    destroy(url: string): void {
        delete this.queue[url]
        // if (!Object.keys(this.queue).length) {
        //     // Spin.hide()
        // }
    }

    interceptors(instance: AxiosInstance, url: string): void {
        // 请求拦截
        instance.interceptors.request.use(
            (req) => {
                this.queue[url] = 1
                return req
            },
            (error: Error) => {
                return Promise.reject(error)
            }
        )

        // 响应拦截
        instance.interceptors.response.use(
            (res) => {
                this.destroy(url)
                return res
            },
            (error) => {
                this.destroy(url)
                return Promise.reject(error)
            }
        )
    }

    request(options: Options) {
        const instance = axios.create()
        const options_: Options = Object.assign({}, this.options, options)
        this.interceptors(instance, options_.url)
        return instance(options_)
    }
}

export default HttpRequest
