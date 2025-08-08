import { color } from 'echarts/core'
import { Style, Fill, Workbook, Worksheet, Row, AddWorksheetOptions } from 'exceljs'
import { saveAs } from 'file-saver'

import { downloadZipWithFiles } from './file'

/**
 * ExcelJS, columns支持chilren, 目前仅支持2级
 */
// 默认的列宽
export const DEFAULT_COLUMN_WIDTH = 20
// 默认行高
export const DEFAULT_ROW_HEIGHT = 20

const DEFAULT_HEADER_BG = 'f8f8f8'

interface Column {
    header: string
    key: string
    width?: number
    children?: Column[]
    [x: string]: any
}

interface Header {
    header: string
    key: string
    children?: Header[]
}

interface ColorStyle {
    fg?: string
    bg?: string
    border?: string
}

interface AlignmentStyle {
    vertical?: string
    horizontal?: string
    wrapText?: boolean
}

interface SizeStyle {
    // width?: number
    height?: number
}

interface FillStyle {
    color?: string
}

interface FontStyle {
    color?: string
    size?: number
    bold?: boolean
}

interface RowStyle extends Partial<Style> {
    color?: ColorStyle
    // alignment?: AlignmentStyle
    size?: SizeStyle
    // fill?: FillStyle
    // font?: FontStyle
}

export function createWorkbook() {
    const workbook = new Workbook()
    workbook.creator = 'system'
    return workbook
}

export function addSheet(workbook: Workbook, name, options = {}) {
    const worksheet = workbook.addWorksheet(name, options)
    return worksheet
}

export function setColumns(worksheet: Worksheet, columns: Column[], isMultiLinesHeader = true) {
    // todo: 先添加headers，否则设置columns的时候会生成默认的headers
    // todo: 先添加headers的话，会导致一级表头名字不对，addHeaders函数需要排查
    worksheet.columns = formatCloumns(columns)
    if (isMultiLinesHeader) {
        addHeaders(worksheet, columns, isMultiLinesHeader)
    }
}

export function addRow(worksheet: Worksheet, row, attrs: RowStyle) {
    const row_ = worksheet.addRow(row)
    setRowStyle(row_, attrs)
}

export function addRows(worksheet: Worksheet, rows, attrs?: RowStyle) {
    const rows_ = worksheet.addRows(rows)
    for (const row_ of rows_) {
        setRowStyle(row_, attrs)
    }
}

function formatCloumns(columns: Column[]) {
    const columns_: Column[] = []
    for (const column of columns) {
        if (!column.children) {
            columns_.push(column)
        } else {
            columns_.push(...formatCloumns(column.children))
        }
    }
    return columns_
}

// 根据 antd 的 column 生成 exceljs 的 column
export function generateHeadersForAntd(columns: any[]) {
    return columns?.map((col) => {
        const obj: any = {
            // 显示的 name
            header: col.title,
            // 用于数据匹配的 key
            key: col.dataIndex,
            // 列宽
            width: col.width / 5 || DEFAULT_COLUMN_WIDTH,
        }
        if (col.children) {
            obj.children = col.children?.map((item: any) => ({
                key: item.dataIndex,
                header: item.title,
                width: item.width,
                parentKey: col.dataIndex,
            }))
        }
        return obj
    })
}

function addHeaders(worksheet: Worksheet, columns: Column[], shouldMergeRowsByWidth = true) {
    // 第一行表头
    const row1Names: string[] = []
    // 第二行表头
    const row2Names: string[] = []
    // 用于匹配数据的 keys
    const headerKeys: string[] = []
    columns.forEach((item) => {
        if (item.children) {
            // 有 children 说明是多级表头，header name 需要两行
            item.children.forEach((child) => {
                row1Names.push(item.header)
                row2Names.push(child.header)
                headerKeys.push(child.key)
            })
        } else {
            row1Names.push(item.header)
            row2Names.push(item.header)
            headerKeys.push(item.key)
        }
    })

    // 判断是否有 children, 有的话是两行表头
    const isMultiHeader = columns?.some((item) => item.children)
    if (isMultiHeader) {
        // 加表头数据
        const row1Headers = worksheet.addRow(row1Names)
        const row2Headers = worksheet.addRow(row2Names)
        // 设置多级表头
        mergeColumnCell(worksheet, columns, row1Headers, row2Headers, row1Names, row2Names)
        // 添加表头样式
        setHeaderStyle(row1Headers)
        setHeaderStyle(row2Headers)
    } else {
        // 加表头数据
        const rowHeader = worksheet.addRow(row1Names)
        // 表头根据内容宽度合并单元格
        if (shouldMergeRowsByWidth) mergeRowCell(worksheet, columns, rowHeader)
        // 添加表头样式
        setHeaderStyle(rowHeader)
    }
}

export function setHeaderStyle(row: Row) {
    const style: any = {
        alignment: {
            vertical: 'middle',
            horizontal: 'center',
            wrapText: true,
        },
        // fill: {
        //     color: DEFAULT_HEADER_BG,
        // },
        font: {
            bold: true,
        },
    }
    setRowStyle(row, style)
}

export function setRowStyle(row: Row, attrs?: RowStyle) {
    const { color, alignment, size, fill, font } = attrs || {}
    if (size?.height) {
        row.height = size?.height
    }
    row.eachCell((cell, colNumber) => {
        cell.alignment = {
            vertical: alignment?.vertical ?? 'middle',
            horizontal: alignment?.horizontal,
            wrapText: alignment?.wrapText ?? true,
        }
        if (color?.bg) {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                bgColor: { argb: color?.bg },
            }
        }
        cell.font = {
            color: font?.color,
            size: font?.size ?? 10.5,
            bold: font?.bold ?? false,
        }
    })
}

export function getColumnNumber(width: number) {
    // 需要的列数，四舍五入
    return Math.round(width / DEFAULT_COLUMN_WIDTH)
}

// 合并行和列，用于处理表头合并
export function mergeColumnCell(
    worksheet: Worksheet,
    headers: any[],
    row1Headers: Row,
    row2Headers: Row,
    row1Names: string[],
    row2Names: string[]
) {
    // 当前 index 的指针
    let pointer = -1
    row1Names.forEach((name, index) => {
        // 当 index 小于指针时，说明这一列已经被合并过了，不能再合并
        if (index <= pointer) return
        // 是否应该列合并
        const shouldVerticalMerge = name === row2Names[index]
        // 是否应该行合并
        const shouldHorizontalMerge = index !== row1Names.lastIndexOf(name)
        pointer = row1Names.lastIndexOf(name)
        if (shouldVerticalMerge && shouldHorizontalMerge) {
            // 两个方向都合并
            worksheet.mergeCells(
                Number(row1Headers.number),
                index + 1,
                Number(row2Headers.number),
                row1Names.lastIndexOf(name) + 1
            )
        } else if (shouldVerticalMerge && !shouldHorizontalMerge) {
            // 只在垂直方向上同一列的两行合并
            worksheet.mergeCells(
                Number(row1Headers.number),
                index + 1,
                Number(row2Headers.number),
                index + 1
            )
        } else if (!shouldVerticalMerge && shouldHorizontalMerge) {
            // 只有水平方向同一行的多列合并
            worksheet.mergeCells(
                Number(row1Headers.number),
                index + 1,
                Number(row1Headers.number),
                row1Names.lastIndexOf(name) + 1
            )
            const cell = row1Headers.getCell(index + 1)
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
        }
    })
}

// 行合并单元格
export function mergeRowCell(worksheet: Worksheet, headers: Column[], row: Row) {
    // 当前列的索引
    let colIndex = 1
    headers.forEach((header) => {
        const { width, children } = header
        if (children) {
            colIndex += children.length
        } else {
            // 需要的列数，四舍五入
            const colNum = getColumnNumber(width)
            // 如果 colNum > 1 说明需要合并
            if (colNum > 1) {
                worksheet.mergeCells(
                    Number(row.number),
                    colIndex,
                    Number(row.number),
                    colIndex + colNum - 1
                )
            }
            colIndex += colNum
        }
    })
}

interface Sheet {
    name: string
    options?: Partial<AddWorksheetOptions>
    columns: Column[]
    rows: Row[]
}
export function exportWorkbook(filename: string, sheets: Sheet[]) {
    const workbook = createWorkbook()
    for (const sheet of sheets) {
        const { name, columns, rows } = sheet
        const worksheet = addSheet(workbook, name, sheet.options)
        setColumns(worksheet, columns)
        addRows(worksheet, rows)
    }
    saveAs(workbook, filename)
}

export function saveWorkbook(workbook: Workbook, fileName: string) {
    // 导出文件
    saveAs(workbookToBlob(workbook), `${fileName}.xlsx`)
}

export async function saveWorkbooksToZip(list, fileName: string) {
    // 批量导出文件
    const files = [] as any
    for (const it of list) {
        const workbook = it.workbook
        const data = await workbook.xlsx.writeBuffer()
        const blob = new Blob([data], { type: '' })
        files.push({
            name: it.name,
        })
    }
    await downloadZipWithFiles(`${fileName}.xlsx`, files)
}

export async function workbookToBlob(workbook: Workbook) {
    const data = await workbook.xlsx.writeBuffer()
    const blob = new Blob([data], { type: '' })
    return blob
}
