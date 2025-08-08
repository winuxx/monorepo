<script setup lang="ts">
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
    TitleComponent,
    GridComponent,
    LegendComponent,
    TooltipComponent,
    DatasetComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { nextTick, ref, watchEffect, onMounted, onUnmounted } from 'vue'

import { objectMerge } from '@q/common/src/utils/std-lib-extensions/object'

echarts.use([BarChart, LineChart, PieChart])
echarts.use([TitleComponent, GridComponent, LegendComponent, TooltipComponent, DatasetComponent])
echarts.use([CanvasRenderer])

const props = defineProps({
    width: {
        // 图表宽
        type: String,
        default: '100%',
    },
    height: {
        // 图表高
        type: String,
        default: '320px',
    },
    loading: {
        // 图形加载
        type: Boolean,
        default: false,
    },
    renderer: {
        // 渲染模式：canvas，svg
        type: null,
        default: 'canvas',
    },
    theme: {
        type: [String, Object],
        default: () => '',
    },
    options: {
        type: Object,
        required: true,
    },
    stopTouchMove: {
        type: Boolean,
        default: () => false,
    },
})

const emit = defineEmits(['chart-click'])

watchEffect(() => {
    // console.log(JSON.stringify(props.options, null, 2))
    update(props.options)
})

onMounted(() =>
    nextTick(() => {
        init()
        if (props.stopTouchMove) {
            chartRef.value.addEventListener('touchmove', onTouchmove)
        }
        window.addEventListener('resize', resize)
    })
)

onUnmounted(() => {
    window.removeEventListener('resize', resize)
    // chartRef.value.removeEventListener('touchmove', onTouchmove)
    clear()
})

const chartRef = ref()

let chart: any = null

function init() {
    if (chart) return
    // console.log(chartRef.value)
    chart = echarts.init(
        // dom, theme, opts
        chartRef.value,
        props.theme || {},
        {
            // width: props.width,
            // height: props.height,
            renderer: props.renderer,
        }
    )
    chart.on('click', onClick)
}

function draw(options: any) {
    // console.log(JSON.stringify(options, null, 2))
    if (chart && options.series) {
        chart.setOption(options)
    } else {
        clear()
    }
}
function update(options: any) {
    nextTick(() => {
        draw(objectMerge({}, defaultOptions, options))
    })
}

function clear() {
    if (chart) {
        chart.clear()
        // chart.dispose()
    }
}

function resize() {
    chart.resize()
}

function onTouchmove(event: Event) {
    // 阻止拖动事件传播, 防止和滑动切换tab冲突
    event.stopPropagation()
}

function onClick(params: Record<string, any>) {
    // console.log('params', params)
    emit('chart-click', params)
}

const defaultOptions = {}

function getChart() {
    return chart
}

defineExpose({
    getChart,
})
</script>

<template>
    <!-- 在父组件设置container, 并设置宽高以占位 -->
    <div ref="chartRef" class="chart"></div>
</template>

<style>
.chart {
    width: 100%;
    height: 100%;
}
</style>
