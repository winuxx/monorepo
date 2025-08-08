import useElTableDrag from '../hooks/el-table-dragable'

export class ElTable {
    table
    rowKey

    constructor(table: any, rowKey: string) {
        this.table = table
        this.rowKey = rowKey
    }

    // 单一选中
    singleSelect(selection: any[], row: Record<string, any>): void {
        for (const it of selection) {
            if (it[this.rowKey] === row[this.rowKey]) {
                this.table.toggleRowSelection(it, true)
            } else {
                this.table.toggleRowSelection(it, false)
            }
        }
    }

    // 选中子节点
    selectChildren(row: Record<string, any>, toSelect: boolean): void {
        if (!this.table) return
        this.table.toggleRowSelection(row, toSelect)
        if (!row.children) return
        row.children.forEach((it: any) => {
            this.table.toggleRowSelection(it, toSelect)
            if (it.children) {
                this.selectChildren(it, toSelect)
            }
        })
    }

    // 递归选中
    nestedSelect(selection: any[], row: Record<string, any>): void {
        if (selection.length === 0) return
        let toSelect = false
        for (const it of selection) {
            if (it[this.rowKey] === row[this.rowKey]) {
                toSelect = true
                break
            }
        }
        this.selectChildren(row, toSelect)
    }

    useElTableDrag: any = useElTableDrag
}
