<script setup lang="ts">
interface Props {
    name: string
    task: Record<string, any>
}
const props = defineProps<Props>()
</script>

<template>
    <span class="name">
        <slot :task="task"></slot>
    </span>
</template>
