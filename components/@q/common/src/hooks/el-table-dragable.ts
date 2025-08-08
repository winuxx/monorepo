/**
 * 注意事项:
 *  - el-table 务必设置 row-key, 否则拖拽后, data顺序成功改变, 但界面顺序会变回去
 */
import { ref, Ref } from 'vue'

import { DragEndCallback, DraggableOption, useDraggable } from './draggable-hooks'

interface Option extends DraggableOption {
    tableId?: string
    columns?: Ref<any[]>
}

/**
 * element ui table drag and drop
 * @param option -
 * - tableId - el table 绑定的 id
 * - data - el table 使用的 data 响应式变量
 * - columns - el table 使用的 columns 响应式变量
 * @returns
 */
function useElTableDrag(option: Option) {
    // 行拖拽
    function useRowDrag(callback?: DragEndCallback) {
        let selector = '.el-table__body-wrapper tbody'
        if (option.tableId) {
            selector = '#' + option.tableId + ' ' + selector
        }
        const data = option.data
        const { useDrag } = useDraggable({ ...option, data })
        return useDrag(selector, callback)
    }

    // 列拖拽
    function useColumnDrag(callback?: DragEndCallback) {
        let selector = '.el-table__header-wrapper tr'
        if (option.tableId) {
            selector = '#' + option.tableId + ' ' + selector
        }
        const data = option.columns ?? ref([])
        const { useDrag } = useDraggable({ ...option, data })
        return useDrag(selector, callback)
    }

    return {
        useRowDrag,
        useColumnDrag,
    }
}

export default useElTableDrag
