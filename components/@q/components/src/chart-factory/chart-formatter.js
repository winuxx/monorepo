import dayjs from 'dayjs'

export function formatAmount(amount, unit = '元') {
    if (isNaN(amount))
        return {
            amount: 0,
            unit,
        }

    if (unit === '元' && amount >= 10000) {
        amount = amount / 10000
        unit = '万元'
    }
    if (unit === '万元' && amount >= 10000) {
        amount = amount / 10000
        unit = '亿元'
    }
    return {
        amount: Math.round(amount * 100) / 100,
        unit,
    }
}

export function xFormatter(fmt = 'MM/DD') {
    return (value) => (isNaN(value) ? value : dayjs(parseInt(value)).format(fmt))
}

export function tFormatter(fmt = 'YYYY-MM-DD HH:mm') {
    return (params) =>
        isNaN(params.value) ? params.value : dayjs(parseInt(params.value)).format(fmt)
}
