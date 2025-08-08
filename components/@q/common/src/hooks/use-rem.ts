import { onMounted, onUnmounted, ref } from 'vue'

import { objectMerge } from '@q/common/src/utils/std-lib-extensions/object'

interface Base {
    size?: number
    width?: number
    height?: number
}

interface Scale {
    min: number
    max: number
}

type Mode = 'auto' | 'width' | 'height'

interface Options {
    base?: Base
    scale?: Scale
    mode?: Mode
}

const defaultOptions: Options = {
    base: {
        width: 1920,
        height: 1080,
        size: 16,
    },
    scale: {
        min: 0.25,
        max: 4,
    },
    mode: 'auto',
}

function useRem(customOptions?: Options) {
    const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'

    const options = ref<Options>(defaultOptions)
    const isPortrait = ref<boolean>(false)

    function setRem() {
        const clientWidth = document.documentElement.clientWidth
        const clientHeight = document.documentElement.clientHeight
        isPortrait.value = clientWidth < clientHeight // 判断竖屏和横屏
        let scale = 1
        switch (options.value.mode) {
            case 'width':
                scale = clientWidth / (options.value.base?.width as number)
                break
            case 'height':
                scale = clientHeight / (options.value.base?.height as number)
                break
            default:
                scale = isPortrait.value
                    ? clientWidth / (options.value.base?.width as number)
                    : clientHeight / (options.value.base?.height as number)
                break
        }
        scale = Math.max(options.value.scale?.min as number, scale) // 最小放大比例
        scale = Math.min(scale, options.value.scale?.max as number) // 最大放大比例
        const size = (options.value.base?.size as number) * scale
        // if (size < 12) size = 12 // hardcode: rem 最小值设为12px
        document.documentElement.style.fontSize = size + 'px'
    }

    function setOptions(runtimeOptions?: Options) {
        options.value = objectMerge(options.value, runtimeOptions)
        setRem()
    }

    onMounted(() => {
        setOptions(customOptions)
        window.addEventListener(resizeEvt, setRem, false)
    })

    onUnmounted(() => {
        window.removeEventListener(resizeEvt, setRem)
    })

    return {
        setOptions,
        isPortrait,
    }
}

export default useRem
export { useRem }
export type { Options as UseRemOptions }
