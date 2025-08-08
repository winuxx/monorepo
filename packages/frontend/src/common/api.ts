import { useEventBus } from '@vueuse/core'

// import router from '@q/common/src/router'
import httpRequest, { ReqBody } from '@/utils/request'
import { objectMerge } from '@/utils/std-lib-extensions/object'


const messageBus = useEventBus<Record<string, any>>('message')
// const loadingBus = useEventBus<Record<string, any>>('loading')
const loginBus = useEventBus<Record<string, any>>('login')

export interface RespBody {
    success: boolean
    code?: number
    message?: string
    msg?: string
    data?: any
    result?: any
}

export interface Ctx {
    req: ReqBody
    res: RespBody
}

export interface Prompt {
    show?: boolean
    title?: string
    message?: string
    msg?: string
}

export interface Propmts {
    disabled?: boolean
    title?: string
    success?: Prompt
    fail?: Prompt
}

export interface Conf {
    timeout?: number
    noLoadingBar?: boolean
    noToken?: boolean
    prompts?: Propmts
}

const defaultConf: Conf = {
    prompts: {
        disabled: false,
        title: '',
        success: {
            show: true, // note: get时默认设为false
            title: 'success',
        },
        fail: {
            show: true,
            title: 'failed',
        },
    },
}

function handlePrompt(prompts: Propmts | undefined, { req, res }: Ctx) {
    if (!prompts || prompts.disabled) {
        return
    }
    if (
        res.success ||
        res.code === 0 ||
        res.code === 200 ||
        (req.responseType === 'blob' && res.data.size)
    ) {
        if (!prompts.success?.show) {
            return
        }
        messageBus.emit({
            type: 'success',
            title: `${prompts?.title ?? ''}${prompts?.success?.title ?? ''}`,
            msg: prompts.success?.msg ?? prompts.success?.message ?? res.message ?? res.msg,
        })
    } else {
        if (!prompts.fail?.show) {
            return
        }
        messageBus.emit({
            type: 'error',
            title: `${prompts?.title ?? ''}${prompts?.fail?.title ?? ''}`,
            msg: prompts.fail?.msg ?? prompts.fail?.message ?? res.message ?? res.msg,
        })
    }
}

// note: 顺序匹配
const urlPrefixFilter: Record<string, string> = {
    '/upms': '',
    '/': '/api',
}
function urlRewrite(url: string) {
    for (const key in urlPrefixFilter) {
        if (url.startsWith(key)) {
            url = urlPrefixFilter[key] + url
            break
        }
    }
    return url
}

// note: 登录失效时:
// 后端需返回对应code，前端无法处理302转向
// 如果后端返回302转向，前端可通过反向代理到自己的server处理
function handleLoginLapses(req: ReqBody, res: RespBody) {
    if (res.code === 401) {
        // gotoLogin()
        loginBus.emit()
        // return
    }
}

// note: 配置优先级
// conf > runtimeConf > defaultConf
export default function (req: ReqBody, conf: Conf = {}): Promise<RespBody> {
    // req.url = urlRewrite(req.url)
    const runtimeConf = {
        prompts: {
            success: {
                show: req.method !== 'get', // note: get时默认设为false
            },
        },
    }

    conf = objectMerge(JSON.parse(JSON.stringify(defaultConf)), runtimeConf, conf)

    // loadingBus.emit({ type: 'start', options: { duration: config.api.timeout } })

    return httpRequest(req, conf)
        .then((res: RespBody) => {
            handlePrompt(conf.prompts, { req, res })
            handleLoginLapses(req, res)
            // loadingBus.emit({ type: 'finish' })
            return res
        })
        .catch((err: any) => {
            // loadingBus.emit({ type: 'error' })
            return err
        })
}
