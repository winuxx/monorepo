import { read, writeFile, utils } from 'xlsx'

import { readArrayBufferFromFile } from './file'

export interface HeaderOption {
    startLine?: number
    endLine?: number
}

export interface Options {
    header: HeaderOption
}

function auto_width(ws: { [x: string]: any }, data: any[]) {
    /* set worksheet max width per col*/
    const colWidth = data.map((row) =>
        row.map((val) => {
            /* if null/undefined*/
            if (val == null) {
                return { wch: 10 }
            } else if (val.toString().charCodeAt(0) > 255) {
                /* if chinese*/
                return { wch: val.toString().length * 2 }
            } else {
                return { wch: val.toString().length }
            }
        })
    )
    /* start in the first row*/
    const result = colWidth[0]
    for (let i = 1; i < colWidth.length; i++) {
        for (let j = 0; j < colWidth[i].length; j++) {
            if (result[j]['wch'] < colWidth[i][j]['wch']) {
                result[j]['wch'] = colWidth[i][j]['wch']
            }
        }
    }
    ws['!cols'] = result
}

function json_to_array(key: any[], jsonData: any[]) {
    return jsonData.map((v) =>
        key.map((j) => {
            return v[j]
        })
    )
}

// fix data,return string
function fixdata(data: ArrayBufferLike) {
    let o = ''
    const w = 10240
    for (let l = 0; l < data.byteLength / w; ++l) {
        o += String.fromCharCode.apply(null, new Uint8Array(data).slice(l * w, l * w + w))
        o += String.fromCharCode.apply(null, new Uint8Array(data).slice(l * w))
    }
    return o
}

// get head from excel file,return array
function get_header_row(sheet: Record<string, any>, option: HeaderOption) {
    const headers = []
    const range = utils.decode_range(sheet['!ref'])
    const r1 = range.s.r + (option.startLine ?? 0) /* start in the first row */
    const r2 = range.s.r + (option.endLine ?? 0)
    for (let c = range.s.c; c <= range.e.c; ++c) {
        /* walk every column in the range */
        let header = ''
        for (let r = r1 - 1; r < r2; ++r) {
            const cell = sheet[utils.encode_cell({ c, r })] /* find the cell in the first row */
            const _header = cell?.t ? utils.format_cell(cell) : '' // : 'UNKNOWN ' + c // <-- replace with your desired default
            if (_header) header = _header
        }
        headers.push(header as never)
    }
    return headers
}

// todo: 只读了第一片 sheet
export function readTableFromData(data: any, type: any, options: Options) {
    /* if type == 'base64' must fix data first */
    // const fixedData = fixdata(data)
    // const workbook = read(btoa(fixedData), { type: 'base64' })
    const workbook = read(data, { type: type })
    return workbook.SheetNames.map((sheetName) => {
        const worksheet = workbook.Sheets[sheetName]
        const headers = get_header_row(worksheet, options.header ?? {})
        const rows = utils.sheet_to_json(worksheet, {
            header: 1, // 从第一行开始解析，必有，否则默认没有第一行
            defval: undefined,
        })
        return { sheetName, headers, rows }
    })
}

export function readWorkBookFromData(data: any, type: any) {
    return read(data, { type: type })
}

export function readSheetsFromData(data: any, type: any) {
    const arrSheets = {}
    const workbook = read(data, { type: type })
    for (const sheetName of workbook.SheetNames) {
        const workSheet = workbook.Sheets[sheetName]
        arrSheets[sheetName.trim()] = utils.sheet_to_json(workSheet, {
            header: 1, // 从第一行开始解析，必有，否则默认没有第一行
            defval: null, // 单元格为空时的默认值，必有，否则默认数据长度与表头不一致
        })
    }
    return arrSheets
}

export async function readTableFromExcel(file: Blob, options: Options) {
    const data = await readArrayBufferFromFile(file)
    return readTableFromData(data, 'array', options)
}

export const exportExcelFromTable = (id: string, filename: any) => {
    const table = document.getElementById(id)
    const wb = utils.table_to_book(table)
    writeFile(wb, filename)

    /* the second way */
    // const table = document.getElementById(id);
    // const wb = utils.book_new();
    // const ws = utils.table_to_sheet(table);
    // utils.book_append_sheet(wb, ws, filename);
    // writeFile(wb, filename);
}

export const exportExcelFromJson = ({ data, key, title, filename, autoWidth }) => {
    const wb = utils.book_new()
    data.unshift(title)
    const ws = utils.json_to_sheet(data, { header: key, skipHeader: true })
    if (autoWidth) {
        const arr = json_to_array(key, data)
        auto_width(ws, arr)
    }
    utils.book_append_sheet(wb, ws, filename)
    writeFile(wb, filename + '.xlsx')
}

export const exportExcelFromArray = ({ key, data, title, filename, autoWidth }) => {
    const wb = utils.book_new()
    const arr = json_to_array(key, data)
    arr.unshift(title)
    const ws = utils.aoa_to_sheet(arr)
    if (autoWidth) {
        auto_width(ws, arr)
    }
    utils.book_append_sheet(wb, ws, filename)
    writeFile(wb, filename + '.xlsx')
}

export function exportHtmlToExcel(elId: string, filename: string, sheetName?: string) {
    const elt = document.getElementById(elId)
    const wb = utils.table_to_book(elt, { sheet: sheetName || filename || 'sheet1' })
    writeFile(wb, `${filename}.xlsx`)
}
