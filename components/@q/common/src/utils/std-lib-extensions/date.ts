export function dateFormat(raw: number | Date, fmt = 'YYYY-MM-DD hh:mm:ss'): string {
    if (!raw) return ''

    const date = new Date(raw || 0)
    let formated = fmt

    const obj: any = {
        'Y+': date.getFullYear(),
        'y+': date.getFullYear(),
        'M+': date.getMonth() + 1,
        'D+': date.getDate(),
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
    }

    for (const key in obj) {
        const reg = new RegExp(`${key}`)

        if (!reg.test(formated)) continue
        const part = formated.match(reg)?.[0] as string
        // String(obj[key]).padStart(fmt.match(reg)[0].length, "0") // ES2017写法
        const rep =
            String(obj[key]).length === 1 && part.length === 2 ? `0${obj[key]}` : `${obj[key]}`
        formated = formated.replace(part, rep)
    }

    return formated
}

