<!-- TODO: md text to html -->
<script setup lang="ts">
const { text = '' } = defineProps({
    text: String,
})
</script>

<template>
    <!-- eslint-disable vue/no-v-html -->
    <div class="md-html" v-html="text"></div>
</template>

<style scoped lang="less">
.md-html {
    // line-height: 1;

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        padding: 0.5em 0;
    }

    p {
        margin: 0.5rem 0;
        // line-height: 1;
    }

    ul,
    ul > li {
        list-style: inside;
    }

    code {
        padding: 0.25rem 0.5rem;
        background-color: var(--highlight-bg);
    }

    table {
        width: 100%;
        padding: 0.5rem 0;
        border-collapse: collapse;

        th,
        td {
            padding: 0.5rem;
            border: 1px solid var(--border-color);
        }

        th {
            background-color: var(--header-bg);
            text-align: left;
        }
    }
}
</style>
