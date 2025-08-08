export function getNodeIndex(ele) {
    let i = 0
    while ((ele = ele.previousSibling)) {
        i++
    }
    return i
}

export function getPlainTextFromHtml(innerHTML: string, replaceSymbol = '') {
    return (
        innerHTML
            ?.replace(/<div>(.*?)<\/div>/g, '\n$1\n')
            ?.replace(/<p>(.*?)<\/p>/g, '\n$1\n')
            ?.replace(/<li>(.*?)<\/li>/g, '\n$1\n')
            ?.replace(/<h\d>(.*?)<\/h\d>/g, '\n$1\n')
            ?.split(/<[^>]+>/g)
            .filter((it) => it)
            .join(replaceSymbol) ?? ''
    )
}

export function getPlainTextFromEl(el: HTMLElement, replaceSymbol = '') {
    return getPlainTextFromHtml(el?.innerHTML ?? '', replaceSymbol)
}

export async function copyText(data: string) {
    const oInput = document.createElement('textarea')
    document.body.appendChild(oInput)
    oInput.innerText = data
    oInput.select() // 选择对象;
    oInput.setSelectionRange(0, data.length)
    await navigator.clipboard
        .writeText(oInput.value)
        .then((res) => {
            console.log('复制成功')
        })
        .catch((err) => {
            console.error('复制失败', err)
        })
    oInput.remove()
}
