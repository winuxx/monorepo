import { saveAs } from 'file-saver'
import Zip from 'jszip'

export function readBinaryStringFromFile(file: Blob) {
    return new Promise((resolve, reject) => {
        try {
            const fileReader = new FileReader()
            fileReader.readAsBinaryString(file)
            fileReader.onload = (event) => {
                resolve(event.target?.result)
            }
        } catch (error) {
            reject(error)
        }
    })
}

export function readTextFromFile(file: Blob): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            const fileReader = new FileReader()
            fileReader.readAsText(file)
            fileReader.onload = (event) => {
                resolve(event.target?.result)
            }
        } catch (error) {
            reject(error)
        }
    })
}

export function readArrayBufferFromFile(file: Blob) {
    return new Promise((resolve, reject) => {
        try {
            const fileReader = new FileReader()
            fileReader.readAsArrayBuffer(file)
            fileReader.onload = (event) => {
                resolve(event.target?.result)
            }
        } catch (error) {
            reject(error)
        }
    })
}

export async function downloadZipWithFiles(name: string, files: FileToZip[]) {
    const zip = new Zip()
    for (const file of files) {
        addFileToZip(zip, file)
    }
    await downloadZip(zip, name)
}

export function createZip() {
    const zip = new Zip()
    return { zip, add: addFileToZip, download: downloadZip }
}

interface FileToZip {
    dir?: string
    name: string
    blob: Blob
}
function addFileToZip(zip: Zip, file: FileToZip, options?: Zip.JSZipFileOptions) {
    if (file.dir) {
        // 带文件夹写入
        zip.folder(file.dir)?.file(file.name, file.blob, options)
    } else {
        zip.file(file.name, file.blob, options)
    }
}

async function downloadZip(zip: Zip, name: string) {
    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, `${name}.zip`)
}

export { saveAs }
