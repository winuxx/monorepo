import { onMounted, onUnmounted, nextTick } from 'vue'

/**
 *
 * @param containerIdOrSector - 外层滚动容器的id | sector
 * @param targetId - 粘滞元素的id
 * @param offset - 偏移距离，以rem=16px为基准
 */
function useSticky(containerIdOrSector: string, targetId: string, offset: number) {
    offset = offset ?? 0

    let scrollContainer: any
    let target: any
    let initTop: number
    let offsetTop: number

    onMounted(() => {
        scrollContainer =
            document.getElementById(containerIdOrSector) ||
            document.querySelector(containerIdOrSector)
        scrollContainer?.addEventListener('scroll', handleScroll, true)

        target = document.getElementById(targetId)

        nextTick(() => {
            initTop = target?.getBoundingClientRect().top ?? 0
            offsetTop = initTop - offset
        })
    })

    onUnmounted(() => {
        scrollContainer?.removeEventListener('scroll', handleScroll)
    })

    function handleScroll() {
        const scrollTop = scrollContainer.scrollTop
        if (scrollTop >= offsetTop) {
            const dynamicTop = scrollTop - offset // - offsetTop
            // console.log(top, initTop, offsetTop, scrollTop, dynamicTop)
            if (target.style.position !== 'sticky') target.style.position = 'sticky'
            target.style.top = `${dynamicTop}PX` // `${dynamicTop / 16}rem`
            if (target.style.zIndex !== '999') target.style.zIndex = '999'
            // target.style.background = '#fff'
        } else {
            if (target.style.position !== '') target.style.position = ''
            if (target.style.top !== '') target.style.top = ''
            if (target.style.zIndex !== '') target.style.zIndex = ''
        }
    }
}

export { useSticky }
