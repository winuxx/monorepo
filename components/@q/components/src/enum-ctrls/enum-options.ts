import { computed } from 'vue'

function useEnumOptions(enums: Record<any, any>) {
    const options = computed(() => {
        const list = [] as any
        for (const k in enums) {
            if (String(Number(k)) === 'NaN') continue
            list.push({
                label: enums[k],
                value: Number(k),
            })
        }
        return list
    })

    return options
}

export default useEnumOptions
