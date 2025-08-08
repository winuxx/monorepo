<script setup lang="ts">
import {
    TitleComponent,
    TitleComponentOption,
    GridComponentOption,
    LegendComponentOption,
    TooltipComponentOption,
    DatasetComponentOption,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { ref, nextTick, watch } from 'vue'

import { objectMerge } from '@q/common/src/utils/std-lib-extensions/object'
import ChartBase from '@q/components/src/chart-factory/chart-base.vue'

type EChartsOption = echarts.ComposeOption<
    | TitleComponentOption
    | GridComponentOption
    | LegendComponentOption
    | TooltipComponentOption
    | DatasetComponentOption
>

echarts.use([TitleComponent])

const props = defineProps({
    title: {
        type: String,
        default: () => '',
    },
    total: {
        type: Number,
        default: () => 0,
    },
    type: {
        type: String,
        default: 'line',
    },
    seriesOption: {
        type: Object,
        default: () => ({}),
    },
    dataset: {
        type: Object,
        default: () => ({}),
    },
    category: {
        type: String,
        default: () => '数量',
    },
    unit: {
        type: String,
        default: () => '个',
    },
    // legendType: Array,
    colors: {
        type: Array,
        default: () => [],
    },
    options: {
        type: Object,
        default: () => ({}),
    },
})

const chart = ref()
const chartContainer = ref()
const chartOption = ref<EChartsOption>({})

watch(
    () => [props.dataset, props.options],
    () => nextTick(() => updateChart()),
    { immediate: true }
)

const defaultColors = ['#00B3FF', '#FFEA07', '#FFA400', '#FF0000']
const defaultColor = '#0975d8'

function genColors(dataset: any) {
    let i = 0
    const l = dataset.source?.length || 0
    let j = 15
    const colors = [] as any[]
    while (i < l && j > 0) {
        colors.push(defaultColor + j.toString(16) + j.toString(16))
        // console.log(defaultColor + j.toString(16) + j.toString(16));
        i += 1
        j -= 3
    }
    return colors
}

const defaultOptions: EChartsOption = {
    title: {
        show: props.title ? true : false,
        text: props.title,
    },
    grid: {
        // top: 0,
        left: 0,
        right: 10,
        bottom: 0,
        containLabel: true,
    },
    legend: {
        top: 10,
        // bottom: 0,
    },
    // dataZoom: {
    //     start: 0,
    //     end: 30
    // },
    tooltip: {
        show: true,
        trigger: 'axis',
        confine: true,
        // axisPointer: {
        //     label: {
        //         formatter: (params) => {
        //             return dateFormat(Number(params.value), 'yyyy-mm-dd HH:MM')
        //         }
        //     }
        // }
        backgroundColor: '#ffffff',
        padding: 16,
        extraCssText: 'color: #8c8c8c; box-shadow: 0px 10px 24px 0px rgba(29, 42, 68, 0.12);',
    },
    xAxis: {
        show: true,
        type: 'category',
        axisLabel: {
            // interval: 0,
            rotate: 30,
            // formatter: (value, index) => {
            //     if (index % 2 != 0) {
            //         return '\n\n' + value
            //     } else {
            //         return value
            //     }
            // },
        },
        // type: 'time', // time, category
        // axisLabel: {
        //     // fmt: 'yyyy-MM-dd hh:mm'
        //     formatter: (value) => {
        //         return dateFormat(Number(value), 'mm.dd')
        //     }
        // }
        // axisTick: { show: false }
        // axisLabel: { }
    },
    yAxis: {
        show: true,
        // type: 'log',
        // logBase: '10',
    },
    // visualMap: {}, //区间内控制显示颜色
    // note: 若父组件未传series, 则根据dataset生成
    // series: [
    //     {
    //         type: 'line',
    //         symbol: 'none',
    //         smooth: true,
    //         color: ['#1890FF'],
    //         label: {
    //             show: true,
    //         },
    //         data: [],
    //     },
    // ],
    // dataset: {
    //     dimensions: ['name', '低风险区', '中风险区', '高风险区', '极高风险区'],
    //     source: [],
    // },
}

function genSeries(dataset: any) {
    const length = (dataset.source?.[0]?.length ?? 0) - 1
    if (length <= 0) return []
    return Array.from({ length })?.fill({
        type: props.type,
        ...props.seriesOption,
    })
}

function updateChart() {
    const options: EChartsOption = Object.assign({}, defaultOptions)
    const dataset = props.dataset || props.options.dataset
    if (dataset && dataset.source) {
        // todo: ArrayAble
        options.dataset = dataset
    }
    if (options.dataset && !options.series) {
        options.series = genSeries(options.dataset)
    }
    chartOption.value = objectMerge(options, props.options)
    // console.log(props.type, chartOption.value)
}

function resize() {
    chart.value.getChart()?.resize()
}

onMounted(() => {
    chartContainer.value.addEventListener('resize', resize)
})
onBeforeUnmount(() => {
    chartContainer.value.removeEventListener('resize', resize)
})

function getChart() {
    return chart.value.getChart()
}

defineExpose({
    getChart,
})
</script>

<template>
    <div ref="chartContainer" class="chart-container">
        <ChartBase ref="chart" v-bind="$attrs" :options="chartOption" />
    </div>
</template>

<style lang="less" scoped>
.chart-container {
    width: 100%;
    height: 100%;
    // padding: 20px;
}
</style>
