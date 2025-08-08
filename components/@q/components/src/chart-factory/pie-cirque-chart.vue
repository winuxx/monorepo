<script setup lang="ts">
import { useTransition } from '@vueuse/core'
import { EChartsOption, LabelFormatterCallback, LabelLayoutOptionCallback } from 'echarts'
import { ref, onMounted, nextTick, watch } from 'vue'

import { objectMerge } from '@q/common/src/utils/std-lib-extensions/object'
import { ChartFactory } from '@q/components/src/chart-factory'

import { formatAmount } from './chart-formatter'

const props = defineProps({
    category: { type: String, default: () => '数量' }, // category=金额 时会自动转换为 万元|亿元
    title: { type: String, default: () => '' }, // 圆环中心的title，若要展示顶部的title，应在外部增加html element
    total: { type: Number, default: () => 0 },
    unit: { type: String, default: () => '个' },
    // legendType: Array,
    unitInline: { type: Boolean, default: () => false },
    showTotal: { type: Boolean, default: () => true },
    showLabel: { type: Boolean, default: () => true },
    showTooltip: { type: Boolean, default: () => true },
    showPercent: { type: Boolean, default: () => true },
    percentCategory: { type: String, default: () => '占比' },
    percentField: { type: String, default: () => 'percent' },
    percentUnit: { type: String, default: () => '%' },
    data: { type: Array, default: () => [] },
    seriesOption: { type: Object, default: () => ({}) },
    options: { type: Object, default: () => ({}) },
})

const chart = ref()
const chartOption = ref({} as any)
// const pieWidth = computed(() => {
//     return chartOption.value.series?.[0]?.radius?.[0] ?? '100%'
// })

watch(
    () => props.data,
    () => nextTick(() => updateChart()),
    { immediate: true }
)

const labelFormater: LabelFormatterCallback = (params) => {
    const value = isNaN(params.value) ? params.value : Math.round(params.value * 100) / 100
    return `${params.name}\n${value}  (${params.percent?.toFixed(2)}%)`
}

const labelLayoutOption: LabelLayoutOptionCallback = (params: Record<string, any>) => {
    const isLeft = params.labelRect.x < chart.value.getChart().getWidth() / 2
    const points = params.labelLinePoints
    // Update the end point.
    if (points)
        points[2][0] = isLeft ? params.labelRect.x : params.labelRect.x + params.labelRect.width
    return {
        labelLinePoints: points,
        hideOverlap: true,
        // moveOverlap: 'shiftY',
    }
}

const formatSubtext = (amount_, unit_) => {
    if (props.category === '金额') {
        const { amount, unit } = formatAmount(amount_, unit_)
        return `{value|${String(amount)}}\n{unit|${unit}}`
    } else {
        return `{value|${String(amount_)}}\n{unit|${unit_}}`
    }
}

const formatValue = () => {
    const { amount, unit } = formatAmount(props.total, props.unit)
    if (props.category === '金额') {
        return {
            amount,
            unit,
        }
    } else {
        return {
            amount: props.total,
            unit: props.unit,
        }
    }
}

const defaultOptions: EChartsOption = {
    title: {
        show: false,
        text: props.title,
        textStyle: {
            color: 'skyblue',
            fontSize: '1rem',
            fontWeight: 'normal',
            // height: '1rem',
        },
        // subtext: String(props.total),
        // subtextStyle: {
        //     color: '#ccc',
        //     fontSize: '1.5rem',
        //     fontWeight: 'bold',
        // },
        subtext: `{value|${String(props.total)}}\n{unit|${props.unit}}`,
        subtextStyle: {
            color: '#ccc',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            rich: {
                // value: {
                //     fontSize: '1.2rem',
                //     fontWeight: 'bold',
                // },
                unit: {
                    fontSize: '0.75rem',
                },
            },
        },

        // top: 'middle',
        top: '35%',
        left: 'center',
        // padding: [0, 0, 50, 0],
        itemGap: 8,
    },
    grid: {
        // top: 20,
        // left: 20,
        // right: 20,
        // bottom: 20,
        // containLabel: false,
    },
    tooltip: {
        show: true,
        trigger: props.showTooltip ? 'item' : undefined,
        confine: true,
        appendToBody: true,
        // backgroundColor: '#000c',
        borderWidth: 0,
        textStyle: {
            color: '#fff',
            fontWeight: 400,
        },
        formatter: function (params: any) {
            const percent =
                Number(
                    params.data[props.percentField] ||
                        params.percent ||
                        params.percentage ||
                        params.rate * 100
                ) || 0
            if (props.showPercent) {
                return `
                    <b>${params.name}</b><br>
                    • ${props.category}：<b>${params.value}</b> ${props.unit}<br>
                    • ${props.percentCategory}：${percent} ${props.percentUnit}
                `
            } else {
                return `
                    <b>${params.name}</b><br>
                    • ${props.category}：<b>${params.value}</b> ${props.unit}<br>
                `
            }
        },
    },
    legend: {
        show: false,
        // data: props.legendType,
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
        // itemWidth: 16,
        // itemHeight: 16,
        itemGap: 15,
        textStyle: {
            color: '#888',
            fontSize: '1rem',
        },
    },
    xAxis: { show: false },
    yAxis: { show: false },
    // visualMap: { //区间内控制显示颜色
    // },
    series: [
        {
            name: props.title,
            type: 'pie',
            // clockwise: false,
            // startAngle: 90,
            // radius: '50%',
            radius: ['60%', '75%'],
            center: ['50%', '50%'],
            // hoverAnimation: false,
            // roseType: 'radius',
            itemStyle: {
                // borderColor: '#fff',
                // borderWidth: 5,
            },
            label: {
                show: props.showLabel,
                color: '#cccccc',
                position: 'outside',
                alignTo: 'edge',
                // alignTo: 'labelLine',
                fontSize: 10,
                lineHeight: 12,
                minMargin: 5,
                edgeDistance: 0,
                // formatter: `{a|{b}\n{c}}${props.unit}\n{d}{dot|}`,
                formatter: labelFormater,
                // rich: {
                //     // dot: {
                //     //     backgroundColor: 't',
                //     //     borderRadius: 100,
                //     //     width: 0,
                //     //     height: 10,
                //     //     padding: [3, 3, 0, -16],
                //     //     shadowBlur: 1,
                //     //     shadowOffsetX: '0',
                //     //     shadowOffsetY: '2',
                //     // },
                //     // a: {
                //     //     color: '#666666',
                //     //     padding: [-35, 15, -20, 5],
                //     // },
                // },
            },
            labelLine: {
                // length: 10,
                // length2: 30,
                // smooth: 0.1,
                lineStyle: {
                    width: 1,
                },
            },
            labelLayout: props.showLabel ? labelLayoutOption : {},
            emphasis: {
                label: {
                    color: '#5aaafa',
                },
                labelLine: {
                    lineStyle: {
                        width: 2,
                    },
                },
            },
            data: props.data,
        },
    ],
}

function updateChart() {
    const options: EChartsOption = Object.assign({}, defaultOptions)
    // options.title = {
    //     ...defaultOptions.title,
    //     text: props.title,
    //     // subtext: String(props.total) + '\n' + props.unit,
    //     subtext: props.showUnitInTitle
    //         ? formatSubtext(props.total, props.unit)
    //         : String(props.total),
    // }
    options.series[0].data = props.data
    if (props.showLabel) {
        // options.series[0].label.formatter = `{a|{b}\n{c}} ${props.unit}{dot|}`
        options.series[0].radius = ['32%', '40%']
        options.series[0].center = ['50%', '50%']
    }
    options.series[0] = objectMerge(options.series[0], props.seriesOption)
    // console.log('options.series[0]', options.series[0])
    chartOption.value = objectMerge(options, props.options)
}

const centerTitleObj: any = computed(() => {
    const { amount, unit } = formatValue()
    return {
        title: props.title,
        value: amount,
        unit: unit,
    }
})
const totalTrans = useTransition(
    computed(() => Number(centerTitleObj?.value?.value) || 0),
    { duration: 600 }
)
const totalTransFixed = computed(() => {
    if (['金额', '比例'].includes(props.category)) return totalTrans.value.toFixed(2)
    else if (['数量'].includes(props.category)) return totalTrans.value.toFixed()
    return totalTrans.value
})

onMounted(() => {
    nextTick(() => {
        // updateChart()
    })
})

defineExpose({
    getChart: () => chart.value.getChart(),
})
</script>

<template>
    <div class="pie-cirque-chart">
        <div class="center-text">
            <div class="text">
                <slot name="title">
                    <div class="title">
                        <template
                            v-for="(item, index) of centerTitleObj.title.split('\\n')"
                            :key="index"
                        >
                            <div>{{ item }}</div>
                        </template>
                    </div>
                    <div v-if="showTotal" :class="{ inline: unitInline }">
                        <div class="value">{{ totalTransFixed }}</div>
                        <div class="unit">{{ centerTitleObj.unit }}</div>
                    </div>
                </slot>
            </div>
        </div>
        <ChartFactory ref="chart" v-bind="$attrs" :title="title" :options="chartOption" />
    </div>
</template>

<style lang="less" scoped>
.pie-cirque-chart {
    position: relative;
    width: 100%;
    height: 100%;
    // padding: 20px;

    .center-text {
        position: absolute;
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;

        .text {
            /* stylelint-disable-next-line value-keyword-case */
            // width: v-bind(pieWidth);

            .title {
                margin-bottom: 0.3rem;
                color: skyblue;
                font-size: 1rem;
                font-weight: normal;
                line-height: 1.25rem;
            }

            .value {
                color: #ccc;
                font-size: 1.4rem;
                font-weight: bold;
                line-height: 1.3rem;
            }

            .unit {
                color: skyblue;
                font-size: 0.8rem;
                line-height: 1.2rem;
            }

            .inline {
                display: flex;
                align-items: flex-end;

                .unit {
                    margin-left: 0.25em;
                    line-height: 1rem;
                }
            }
        }
    }
}
</style>
