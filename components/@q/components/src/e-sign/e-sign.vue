<script setup lang="ts">
import vueEsign from 'vue-esign'

import { base64ImgtoFile } from '@q/common/src/utils/image'

const emit = defineEmits(['confirm', 'cancel'])

const options = {
    bgColor: '#0000',
    isCrop: false,
    lineWidth: 6,
    lineColor: 300,
}

const esign = ref()
const imgSrc = ref('')

function onCancel() {
    emit('cancel')
}

// 清空画布
function onReset() {
    esign.value.reset()
}

// 生成签名的base64图片
function onGenerate() {
    esign.value
        .generate()
        .then((res) => {
            imgSrc.value = res
            // console.log(res )
            emit('confirm', res, base64ImgtoFile(res))
        })
        .catch((err) => {
            console.log('画布没有签字时会执行这里 Not Signned')
        })
}
</script>

<template>
    <div class="e-sign">
        <header>
            <el-button type="" @click="onReset">重置</el-button>
        </header>
        <div class="container">
            <vue-esign
                ref="esign"
                v-model:bg-color="options.bgColor"
                :width="800"
                :height="300"
                :is-crop="options.isCrop"
                :line-width="options.lineWidth"
                :line-color="options.lineColor"
            />
        </div>
        <footer>
            <el-button type="" @click="onCancel">取消</el-button>
            <el-button type="primary" @click="onGenerate">确定</el-button>
        </footer>
        <!-- <img :src="imgSrc" width="400" height="400" /> -->
    </div>
</template>

<style scoped lang="less">
.e-sign {
    display: flex;
    flex-direction: column;

    .container {
        border: 1px solid var(--border-color);
    }
}
</style>
