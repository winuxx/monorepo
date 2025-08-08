function stringifyQueryParams(p: { [x: string]: string }) {
    let s = ''
    let i = 0
    for (const k in p) {
        const f = (i === 0 ? '?' : '$') + k + '=' + p[k]
        s += f
        i += 1
    }
    return s
}

function service(req: any = {}): Promise<Response> {
    let url: RequestInfo = req.url
    const options: RequestInit = {
        method: req.method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'error', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(req.data), // body data type must match "Content-Type" header
    }

    if (req.params) {
        url += stringifyQueryParams(req.params)
    }

    return fetch(url, options)
        .then((res) => {
            // if (res.status === 401) throw new Error('身份验证过期，请重新登录')
            // else if (res.status === 404) throw new Error('找不到数据')
            // else if (res.status >= 500) throw new Error('网络错误')
            // else return res
            if (res.status >= 200 && res.status < 300) return res
            else throw new Error(String(res.status))
            // const error = new Error()
            // error.name = res.status
            // error.message = res.statusText
        })
        .then((res) => {
            if (res.type.valueOf() === 'blob') return res.blob()
            else return res.json()
        })
        .catch((error) => {
            console.error('api error:', error)
            // let msg
            // if (error.message.startsWith('JSON.parse')) {
            //     msg = '数据格式错误'
            // } else if (error.message.startsWith('NetworkError')){
            //     msg = '网络错误或被重定向'
            // }else {
            //     msg = error.message
            // }
            return Promise.reject(error)
        })
}

export default service
