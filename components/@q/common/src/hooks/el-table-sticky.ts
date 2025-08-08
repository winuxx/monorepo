import { onMounted, onUnmounted, nextTick } from 'vue'

/**
 *
 * @param containerId - 外层滚动容器的id，或sector
 * @description - top / offset 设置一个
 * @param top - 固定位置到页面顶部的距离，以rem=16px为基准 - 默认60，即页面header高度
 * @param offset - 偏移距离，以rem=16px为基准
 */
function useElTableSticky(
    containerId: string,
    { top, offset }: { top?: number; offset?: number } = {},
    onScoll?: (...args: any[]) => any
) {
    top = top ?? 60 // 默认设置1px以避免border往上滚动导致1px偏差

    let scrollContainer: any
    let header: any
    let initTop: number
    let offsetTop: number = top ?? 0

    onMounted(() => nextTick(() => init()))

    onUnmounted(() => {
        scrollContainer?.removeEventListener('scroll', handleScroll)
    })

    function init() {
        scrollContainer =
            document.getElementById(containerId) || document.querySelector(containerId)
        scrollContainer?.addEventListener('scroll', handleScroll, true)

        const table = document.getElementsByClassName('el-table')[0]
        const tableBody = table.getElementsByClassName('el-table__body')[0]
        header =
            table.getElementsByClassName('el-table__header-wrapper')[0] || // table-layout: fixed
            tableBody.getElementsByTagName('thead')[0] // table-layout: auto

        initTop = header?.getBoundingClientRect().top ?? 0
        offsetTop = initTop - (top ?? 0) + (offset ?? 0)
    }

    function handleScroll() {
        // const headerTop = header.getBoundingClientRect().top ?? 0
        const scrollTop = scrollContainer.scrollTop
        if (scrollTop >= offsetTop) {
            const dynamicTop = scrollTop - offsetTop
            // console.log(top, initTop, offsetTop, scrollTop, dynamicTop)
            if (header.style.position !== 'sticky') header.style.position = 'sticky'
            header.style.top = `${dynamicTop}Px`
            if (header.style.zIndex !== '99') header.style.zIndex = '99'
        } else {
            if (header.style.position !== '') header.style.position = ''
            if (header.style.top !== '') header.style.top = ''
            if (header.style.zIndex !== '') header.style.zIndex = ''
        }
        onScoll?.({
            scrollTop,
            offsetTop,
        })
    }
}

export default useElTableSticky
