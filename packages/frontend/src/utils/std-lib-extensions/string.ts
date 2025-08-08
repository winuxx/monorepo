export function isNumber(str: string): boolean {
    return !isNaN(Number(str))
}

export function isDigit(str: string | number | undefined): boolean {
    return Number(str) === parseInt(String(str))
}

export function strip(orig: string, key = ' '): string {
    return orig.replace(new RegExp(`^[${key}]+|[${key}]+$`, 'g'), '')
}
