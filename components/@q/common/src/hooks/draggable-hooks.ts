import Sortable, { SortableEvent, Options as SortableOptions } from 'sortablejs'
import { onMounted, onUnmounted, ref, Ref , watch , toRef , isRef , isReactive } from 'vue'





/**
 * 注意事项:
 *  - el-table 务必设置 row-key, 否则拖拽后, data顺序成功改变, 但界面顺序会变回去
 */

export interface DraggableOption {
    data: Ref<any[]>
    sortableOptions?: SortableOptions
}

interface Vars {
    start: number
    end: number
    newIndex: number
    oldIndex: number
}
export interface DragEndCallback {
    (sorted: any[], vars: Vars): void | Promise<void>
}

const defaultSortableOptions: SortableOptions = {
    animation: 300,
    delay: 0,
    filter: '.no-drag',
    // draggable: '.dragable',
    // handle: '.drag-to-sort',
    // dragClass: 'drag-item',
}

/**
 * drag and drop
 * @param option
 * - data: 响应式数组变量
 * @description 拖拽事件响应方式：
 * 1. 回调
 * 2. 监听响应式数据变化
 * @returns
 */
function useDraggable(option: DraggableOption) {
    let elTable: HTMLElement | null = null
    let mixedOption: SortableOptions = {}
    const sourceData: Ref<any[]> = option.data

    if (!isRef(sourceData)) {
        throw new Error('data should be a Ref')
    }

    onMounted(() => {
        document.body.addEventListener('drop', onDrop)
    })

    onUnmounted(() => {
        document.body.removeEventListener('drop', onDrop)
    })

    function onDrop(event: Event) {
        // 阻止默认行为
        event.preventDefault()
        event.stopPropagation()
    }

    watch(sourceData, (val) => {
        updateDragable()
    })

    function updateDragable() {
        if (!elTable) {
            return
        }
        if (mixedOption?.handle) {
            const handleEls = elTable?.querySelectorAll(
                mixedOption.handle
            ) as unknown as HTMLElement[]
            for (const it of handleEls) {
                it.style.cursor = 'grab' // 设置光标样式
            }
        } else {
            elTable.style.cursor = 'grab' // 设置光标样式
        }
    }

    function useDrag(
        selector: string,
        // sourceData?: Ref<any[]>,
        callback?: DragEndCallback
    ) {
        elTable = document.querySelector(selector) as HTMLElement
        mixedOption = Object.assign({}, defaultSortableOptions, option?.sortableOptions)
        updateDragable()

        return Sortable.create(elTable, {
            ...mixedOption,
            onEnd: async ({ newIndex, oldIndex }: SortableEvent) => {
                if (newIndex === undefined || oldIndex === undefined) return
                if (newIndex === oldIndex) return // 拖拽结束后，若排序未变，则忽略
                const currentItem = sourceData?.value.splice(oldIndex, 1)[0]
                sourceData?.value.splice(newIndex, 0, currentItem)
                // 找到受影响的范围
                const start = Math.min(oldIndex, newIndex)
                const end = Math.max(oldIndex, newIndex)
                // 对范围内的元素排序
                const sorted = sourceData?.value.slice(start, end + 1) ?? []
                await callback?.(sorted, { start, end, newIndex, oldIndex })
                updateDragable()
            },
        })
    }

    return {
        useDrag,
        updateDragable,
    }
}

export { useDraggable }
