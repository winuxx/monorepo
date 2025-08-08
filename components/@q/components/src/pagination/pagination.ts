import { useLocalStorage } from '@vueuse/core'
import { onMounted, reactive, ref, watch, Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { objectMerge } from '@q/common/src/utils/std-lib-extensions/object'

interface CallbackFunction {
    // (size: number, no: number): void
    (): Promise<any>
}

interface Options {
    scoped?: boolean
    fixedSize?: number
    defaultSize: number
    defaultNo: number
    startNo: number
}

const defaultOptions: Options = {
    scoped: false,
    fixedSize: undefined,
    defaultSize: 10,
    defaultNo: 1,
    startNo: 1,
}

export default function usePagination(getData: CallbackFunction, options?: Options): any {
    const mixedOptions = objectMerge(defaultOptions, options) as Options
    console.log('page options:', mixedOptions)
    const total = ref<number>(0)
    // const pageSize = ref<number>(mixedOptions.defaultSize)
    // note: 固化分页大小
    const pageSize = mixedOptions.fixedSize
        ? ref(mixedOptions.fixedSize)
        : (useLocalStorage('pageSize', mixedOptions.defaultSize) as unknown as Ref<number>)
    const pageNo = ref<number>(mixedOptions.defaultNo)
    const loading = ref<boolean>(false)

    const pageRefs = {
        total: total,
        size: pageSize,
        no: pageNo,
        loading: loading,
        refresh: refreshPage,
        reset: resetPage,
    }

    const router = useRouter()
    const route = useRoute()

    onMounted(() => {
        if (mixedOptions.scoped) {
            return
        }
        if (route.query.pageSize) {
            pageSize.value = Number(route.query.pageSize)
        }
        if (route.query.pageNo) {
            pageNo.value = Number(route.query.pageNo)
        }
    })

    watch([pageSize, pageNo], () => {
        if (mixedOptions.scoped) {
            return
        }
        router.replace({
            path: route.path,
            query: {
                ...route.query,
                pageNo: pageNo.value,
                pageSize: pageSize.value,
            },
        })
    })

    watch(pageSize, (value, oldValue) => {
        // note: 通过当前页第一项/最后一项计算应该跳到多少页
        console.debug('page size change', oldValue, '->', value)
        const threshold = (pageNo.value - 1) * oldValue + 1
        pageNo.value = parseInt(String(threshold / value)) + 1
        // note: 若计算的页码大于最大页码, 则改为最大页码 - needless
        // let maxPageNo = (props.total as number) / pageSize.value
        // if (pageNo.value > maxPageNo) {
        //     pageNo.value = parseInt(String(maxPageNo))
        // }
        getPage()
    })

    watch(pageNo, (value, oldValue) => {
        // pageNo.value = val
        console.debug('page no change', oldValue, '->', value)
        getPage()
    })

    async function getPage() {
        if (pageNo.value < mixedOptions.startNo) {
            return
        }
        loading.value = true
        await getData()
        loading.value = false
    }

    function changePage(args: { size: number; no: number }) {
        if (args.size) pageSize.value = args.size
        if (args.no) pageNo.value = args.no
    }

    function refreshPage() {
        console.debug('page refresh')
        getPage()
    }

    function resetPage() {
        console.debug('page reset')
        if (pageNo.value === mixedOptions.startNo) {
            getPage()
        } else {
            pageNo.value = mixedOptions.startNo as number
        }
    }

    return {
        pageRefs,
        total,
        pageSize,
        pageNo,
        changePage,
        refreshPage,
        resetPage,
    }
}
