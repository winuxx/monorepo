import { onMounted, nextTick } from 'vue'

function useKeyupListener(callback, options) {
    const entity = options.ref ?? document
    onMounted(() =>
        nextTick(() => {
            entity.addEventListener('keyup', (event) => {
                if (event.isComposing || event.keyCode === 229) {
                    return
                }
                // do something
            })
        })
    )
}

export { useKeyupListener }
