// import TableToExcel from '@linways/table-to-excel'

const dataTypeMap = {
    csv: 'text/csv',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}
export function exportTableToExcel(
    tableIdOrEl: HTMLTableElement | string,
    filename = 'excel-file',
    ext = 'xlsx'
) {
    const dataType = dataTypeMap[ext] ?? dataTypeMap['xlsx']

    const tableEl =
        typeof tableIdOrEl === 'string' ? document.getElementById(tableIdOrEl) : tableIdOrEl
    const tableHTML = tableEl.outerHTML.replace(/\s/g, '%20').replaceAll(/<input.*?>/g, '')
    console.log(tableEl.outerHTML.replaceAll(/<input.*?>/g, ''))

    // for IE
    // if (navigator.msSaveOrOpenBlob) {
    //     const blob = new Blob(['\ufeff', tableHTML], {
    //         type: dataType,
    //     })
    //     navigator.msSaveOrOpenBlob(blob, filename)
    // }

    const downloadLink = document.createElement('a')
    downloadLink.type = dataType
    downloadLink.href = `data:${dataType};charset=gb2312,${tableHTML}`
    downloadLink.download = `${filename}.${ext}`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
}

export function exportTableToExcel2(tableId: string) {
    const style = `
        table td {
            border: 1px solid #000000;
            width: 200px;
            height: 30px;
            text-align: center;
        }
    `
    let excel = ''
    excel += '<table>'
    const html = document.getElementById(tableId).innerHTML
    excel += html
    excel += '</table>'
    let excelFile =
        "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:" +
        excel +
        "' xmlns='http://www.w3.org/TR/REC-html40'>"
    excelFile =
        excelFile +
        `<head><style type="text/css">${style}</style></head>` +
        excel +
        '</body></html>'
    const base64data = 'base64,' + window.btoa(unescape(encodeURIComponent(excelFile)))
    window.open('data:application/vnd.ms-excel;' + base64data)
}

// export function exportTableToExcel3(tableId: string, filename, ext = 'xlsx', sheetName = '') {
//     TableToExcel.convert(document.getElementById(tableId), {
//         name: filename,
//         sheet: {
//             name: sheetName,
//         },
//     })
// }

export function exportElTableToExcel(tableId: string, filename = 'excel-file', ext = 'xlsx') {
    // add border
    const container = document.getElementById(tableId)
    const tables = container.getElementsByTagName('table')
    for (const table of tables) {
        table.border = '1'
    }
    exportTableToExcel(tableId, filename, ext)
    // exportTableToExcel2(tableId)
    // exportTableToExcel3(tableId, filename, ext)
    // remove border
    for (const table of tables) {
        table.border = '0'
    }
}

export function exportTableToCsv(
    tableIdOrEl: HTMLTableElement | string,
    filename = 'csv-file.csv'
) {
    const tableEl =
        typeof tableIdOrEl === 'string' ? document.getElementById(tableIdOrEl) : tableIdOrEl
    const tableHTML = tableEl.outerHTML.replace(/"/g, '""')
    const csv = `data:text/csv;charset=utf-8,${tableHTML}`
    const downloadLink = document.createElement('a')
    downloadLink.href = encodeURI(csv)
    downloadLink.download = filename
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
}
