import { ref, nextTick } from 'vue'

import { generateDebounce } from '@q/common/src/utils'

/**
 * 无限滚动加载
 * @description 与table和pagination配合使用
 * @description 自动加载模式时, 默认禁用分页, size固定为10
 * @param param0
 * @param param1
 * @returns
 */
// 用法示例
// <template #append>
//   <span v-if="showInfiniteScroll" v-infinite-scroll="onLoad" class="loader">
//       <el-button link @click="onContinue">
//           <span class="gray">继续加载</span>
//       </el-button>
//       <el-button link @click="onReset"><span class="gray">重置</span></el-button>
//   </span>
// </template>·

function useInfiniteScroll({ getData, key }, { total, pageNo, pageSize }) {
    let started = false
    const data = ref([])
    const showInfiniteScroll = ref(true)
    const loading = ref(false)
    const searchDebounce = generateDebounce()

    function resetPage() {
        console.log('reset page')
        data.value = []
        pageNo.value = 1
        started = false
        showInfiniteScroll.value = false
        nextTick(() => {
            showInfiniteScroll.value = true
            // onLoad()
        })
    }

    function onLoad() {
        searchDebounce(async () => {
            if (loading.value) {
                console.log('loading', pageNo.value)
                return
            }
            if (started && pageNo.value * pageSize.value >= total.value) {
                console.log('load finished', pageNo.value)
                return
            }
            if (!started) {
                console.log('load start', pageNo.value)
                const ids: any[] = data.value.map((it) => it[key])
                const pageData = await getData()
                data.value = data.value.concat(pageData.filter((it: any) => !ids.includes(it[key])))
                started = true
                console.log('load done', pageNo.value)
            } else {
                pageNo.value += 1
                console.log('load continue', pageNo.value)
            }
        }, 0)
    }

    function onContinue() {
        if (started && pageNo.value > total.value / pageSize.value) {
            return
        }
        started = true
        pageNo.value += 1
    }

    function onReset() {
        resetPage()
    }

    return {
        onLoad,
        onContinue,
        onReset,
    }
}

export { useInfiniteScroll }
