<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { computed } from 'vue'

// todo: 更精细的权限控制, 不同组织不同权限
// todo: 多条件匹配，多个entity[与、或]
// todo: 更多的控制方式, 显隐、提示等
/* note:
    entity: /personal-manage/employee-info:view
        分隔符: ':'
        资源: /personal-manage/employee-info
        操作: view
    优先匹配:
        若有操作, 则匹配操作, 若匹配, 则拥有该操作权限
        若无操作, 则匹配资源, 若匹配, 则拥有该资源所有操作权限
*/
/* workaround:
    admin超级管理员绕过权限控制。应当后端实现
    '', '/', '/home', '/home/...' 不控制权限
*/

const props = defineProps({
    entity: {
        type: String,
        default: undefined,
    },
})

interface Permissions {
    [x: string]: any
}
const permissions = useStorage<Permissions>('permissions', {})
const valid = computed(() => {
    // console.log(props.entity, permissions.value)

    // todo: workaround: admin超级管理员绕过权限控制。应当后端实现
    const username = localStorage.getItem('username')
    if (username === 'admin') {
        return true
    }

    if (
        props.entity === '' ||
        props.entity === '/' ||
        props.entity === '/home' ||
        (props.entity && props.entity.startsWith('/home/'))
    ) {
        return true
    }

    if (!props.entity) {
        return false
    }

    let allActions = true

    for (const k in permissions.value) {
        for (const it of permissions.value[k]) {
            if (it.entity === props.entity) {
                return true
            }
            if (it.entity.split(':') === props.entity) {
                allActions = false
            }
        }
    }

    if (!allActions) return false

    for (const k in permissions.value) {
        for (const it of permissions.value[k]) {
            if (it.entity.split(':') === props.entity) {
                return true
            }
        }
    }

    return false
})
// const show = ref(false)

// watch(
//     () => props.entity,
//     (val) => {
//         // console.log('id:', val)
//         valid.value = val ? true : false
//     },
//     { immediate: true }
// )
</script>

<template>
    <template v-if="valid">
        <slot />
    </template>
</template>
