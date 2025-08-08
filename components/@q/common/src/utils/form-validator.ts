import { useEventBus } from '@vueuse/core'

const messageBus = useEventBus<Record<string, any>>('message')

interface Message {
    (a?: string): string
}

interface Rule {
    required?: boolean
    trigger?: string | string[]
    message?: string | Message | any
    [x: string]: any
}

interface Callback {
    (arg0?: any): void
}

export async function nuiFormValidate(form) {
    return await new Promise((res) =>
        form.validate((errors) => {
            if (!errors) {
                res(true)
            } else {
                messageBus.emit({
                    type: 'error',
                    msg: '请检查表单填写是否正确',
                })
                res(false)
            }
        })
    )
}

export function isMobilePhone(rule: { required: boolean }, value: string): boolean {
    if (!rule.required && !value) {
        return true
    }
    const reg = /^1[34578][0-9]\d{8}$/
    return reg.test(value)
}

export function isMobilePhoneAsync(rule: Rule, value: string, callback: Callback): any {
    const reg = /^1[34578][0-9]\d{8}$/
    const msg = '您输入的手机号不合法，请重新输入'

    if (!rule.required && !value) callback()
    const valid = reg.test(value)
    if (valid) callback()
    callback(new Error(rule.message || msg))
}

export function isEmail(rule: { required: boolean }, value: string): boolean {
    if (!rule.required && !value) {
        return true
    }
    const reg = /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
    return reg.test(value)
}

export function isEmailAsync(rule: Rule, value: string, callback: Callback): any {
    const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+\.([a-zA-Z0-9_-]+)/
    const msg = '您输入的邮箱地址不正确，请重新输入'

    if (!rule.required && !value) callback()
    const match = value.match(reg)
    const valid = match && match[1].length > 1
    if (valid) callback()
    callback(new Error(rule.message || msg))
}

// 姓名中文校验
export function isNameAsync(rule: Rule, value: string, callback: Callback) {
    if (!rule.required && !value) {
        callback()
    }
    const reg = /^[\u4e00-\u9fa5]{2,4}$/
    if (!reg.test(value)) {
        callback(new Error('姓名不合法，请重新输入'))
    }
    callback()
}
