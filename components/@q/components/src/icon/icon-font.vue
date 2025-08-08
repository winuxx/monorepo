<template>
    <i :class="[name, 'iconfont']" :style="styles"></i>
</template>

<script setup lang="ts">
defineProps({
    name: { type: String, default: '' },
    styles: { type: Object, default: () => ({}) },
})
</script>

<style lang="less">
.iconfont {
    display: inline-block;
    min-width: 1em;
    font-size: 1em;
    vertical-align: middle;
}
</style>
