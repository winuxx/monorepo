// import dd from 'gdt-jsapi'
import dd from 'dingtalk-jsapi'

// import takePhoto from 'gdt-jsapi/takePhoto'
import config from '@/../config'

const ddConfig = config.dd

export function ddReady() {
    return new Promise((resolve, reject) => {
        try {
            const timer = setTimeout(() => {
                reject(new Error('timeout'))
            }, 5000)
            return dd.ready(() => {
                clearTimeout(timer)
                console.log('dd ready')
                resolve(null)
            })
        } catch (error) {
            reject(new Error('not dd env'))
        }
    })
}

export function isInDd() {
    // note: 获取后放到vue的变量中
    try {
        // await ddReady()
        // console.log(dd.env.platform)
        if (dd.env?.platform !== 'notInDingTalk') {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

export function getPhoneInfo() {
    return dd.device.base
        .getPhoneInfo({})
        .then((res) => res)
        .catch((err) => err)
}

export function getLoginUser() {
    return dd.biz.user
        .get({})
        .then((res) => res)
        .catch((err) => err)
}

export async function authConfig(ticket) {
    await ddReady()
    return dd.config({
        ticket: ticket, // ticket 从后台获取
        jsApiList: ddConfig.jsApiList, // ['getGeolocation']
    })
    // .then((res) => {
    //     return res
    // })
    // .catch((err) => err)
}

export async function getAuthCode(corpId?: string) {
    // code 授权码（移动端返回值），有效期5分钟，且只能用一次
    // auth_code 授权码（PC端返回值），有效期5分钟，且只能用一次
    // expireTime 失效时间
    await ddReady()
    return dd
        .getAuthCode({
            corpId: corpId ?? ddConfig.corpId,
        })
        .then((res) => res)
        .catch((err) => err)
}

export function showLoading() {
    dd.showLoading({
        content: '加载中...', // 提示信息
    })
        .then((res) => res)
        .catch((err) => err)
}

export function hideLoading() {
    dd.hideLoading({})
        .then((res) => res)
        .catch((err) => err)
}

export async function setTitle(title) {
    await ddReady()
    dd.biz.navigation
        .setTitle({
            title: title,
        })
        .then((res) => res)
        .catch((err) => err)
}

// export async function getGeolocation() {
//     return dd
//         .getGeolocation({
//             targetAccuracy: 20,
//             coordinate: 1,
//             withReGeocode: false,
//             useCache: false, // 默认是true，如果需要频繁获取地理位置，请设置false
//         })
//         .then((res) => ({ success: true, ...res }))
//         .catch((err) => ({ success: false, message: err.errorMessage || err }))
// }

// export async function getGeolocationStatus(sceneIds) {
//     return dd
//         .getGeolocationStatus({
//             sceneIds: sceneIds,
//         })
//         .then((res) => ({ success: true, ...res }))
//         .catch((err) => ({ success: false, message: err.errorMessage || err }))
// }

// export async function startGeolocation(options = { sceneId: 0 }) {
//     const defaultOptions = {
//         targetAccuracy: 20,
//         iOSDistanceFilter: 50,
//         useCache: true,
//         withReGeocode: false,
//         callBackInterval: 1000,
//         sceneId: options.sceneId,
//         onSuccess: (result) => {
//             console.log(result)
//         },
//         onFail: (error) => {
//             console.log(error)
//         },
//     }
//     return dd
//         .startGeolocation(objectMerge(defaultOptions, options))
//         .then((res) => ({ success: true, ...res }))
//         .catch((err) => ({ success: false, message: err.errorMessage || err }))
// }

// export async function stopGeolocation(sceneId) {
//     return dd
//         .stopGeolocation({
//             sceneId: sceneId,
//         })
//         .then((res) => ({ success: true, ...res }))
//         .catch((err) => ({ success: false, message: err.errorMessage || err }))
// }

export function openLink(url) {
    dd.openLink({
        url: url,
    })
        .then((res) => res)
        .catch((err) => err)
}

// export function takePhoto() {
//     dd.takePhoto()
//         .then((res) => res)
//         .catch((err) => err)
// }

// export function chooseImage(enableVideo) {
//     dd.chooseImage({
//         enableVideo: enableVideo,
//     })
//         .then((res) => res)
//         .catch((err) => err)
// }

// export function shootVideo() {
//     dd.shootVideo()
//         .then((res) => res)
//         .catch((err) => err)
// }
