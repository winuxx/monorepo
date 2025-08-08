<script setup lang="ts">
const router = useRouter()

function onMenuClick(name: string) {
    router.push({
        name,
    })
}
</script>

<template>
    <div class="page-header">
        <a @click="onMenuClick('Home')">Home</a>
        <el-divider direction="vertical" />
        <a @click="onMenuClick('ShopAndCart')">Shop and Cart</a>
        <el-divider direction="vertical" />
        <a @click="onMenuClick('Product')">Admin</a>
    </div>
</template>

<style scoped lang="less">
.page-header {
    display: flex;
    width: 100%;
    height: 60px;
    align-items: center;
    padding: 0;
    margin: 0;
    line-height: 1;
}
</style>
