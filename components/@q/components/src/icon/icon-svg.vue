<template>
    <svg class="icon" :style="styles" aria-hidden="true">
        <use :xlink:href="'#' + name"></use>
    </svg>
</template>

<script setup lang="ts">
defineProps({
    name: { type: String, default: '' },
    styles: { type: Object, default: () => ({}) },
})
</script>

<style lang="less">
.icon {
    overflow: hidden;
    width: 1em;
    height: 1em;
    fill: currentcolor;
    vertical-align: -0.15em;
}
</style>
