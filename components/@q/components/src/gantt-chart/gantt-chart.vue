<script setup lang="ts">
/** 甘特图通用组件
 * API: https://docs.dhtmlx.com/gantt/api__refs__gantt.html
 * Properties: https://docs.dhtmlx.com/gantt/api__refs__gantt_props.html
 * Events: https://docs.dhtmlx.com/gantt/api__refs__gantt_events.html
 * Data Properties: https://docs.dhtmlx.com/gantt/desktop__loading.html#dataproperties
 */
// import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
import 'dhtmlx-gantt/codebase/skins/dhtmlxgantt_material.css'

import { useDark } from '@vueuse/core'
import { gantt, GridColumn } from 'dhtmlx-gantt'

import { objectMerge } from '@q/common/src/utils/std-lib-extensions/object'
import { convertListToTree } from '@q/common/src/utils/tree'

import { GanttEventItem, GanttOptions, GanttTasks, generateLinksForTree } from './gantt-chart-tools'

const slots = useSlots()

interface ComponentSettings {
    ignoreWeekEnd: boolean
    autoGenerateLinks: boolean
}

interface Props {
    tasks: GanttTasks
    columns?: GridColumn[]
    options?: GanttOptions
    events?: GanttEventItem[]
    settings?: ComponentSettings
}
const props = withDefaults(defineProps<Props>(), {
    tasks: () => ({
        data: [],
        links: [],
    }),
    columns: () => [],
    options: () =>
        ({
            scale_unit: 'day', // “minute”, “hour”, “day”, “week”, “quarter”, “month”, “year”
            // date_scale: '%Y-%m-%d',
        }) as GanttOptions,
    events: () => [],
    settings: () => ({
        ignoreWeekEnd: true,
        autoGenerateLinks: true,
    }),
})

const emit = defineEmits([])

// onBeforeMount(() => {
//     loadSkin(false)
// })
onMounted(() => {
    // applyColumnTemplateFromSlot()
    reset()
})
onBeforeUnmount(() => {
    try {
        gantt.clearAll()
        gantt.detachAllEvents()
        // gantt.destructor()
    } catch (error) {}
})
watch(
    () => props.tasks.data,
    () => update()
)
watch(
    () => [props.columns, props.options, props.events],
    () => reset(),
    { deep: true }
)

const containerRef = ref()

const defaultOptions: GanttOptions = {
    readonly: true, // 只读
    // xml_date: '%Y-%m-%d',
    date_format: '%Y-%m-%d',
    work_time: true, // removes non-working time from calculations
    // skip_off_time : true, // hides non-working time in the chart // PRO version only
    drag_progress: true,
    // date_scale: '%Y-%m-%d',
}

function init() {
    console.debug('gantt init')
    // 默认配置
    gantt.i18n.setLocale('cn') // 设置中文

    const mixedOptions: GanttOptions = objectMerge({}, defaultOptions, props.options)
    for (const key in mixedOptions) {
        gantt.config[key] = mixedOptions[key]
    }

    // 显示列配置
    if (props.columns?.length) {
        gantt.config.columns = props.columns
    }

    gantt.templates.grid_folder = (item) => {
        item.$open = true
        return `<div class="gantt_tree_icon gantt_folder_${item.$open ? 'open' : 'closed'}"></div>`
    }
    gantt.templates.task_unscheduled_time = (task) => {
        if (task.unscheduled) {
            task.duration = null
        }
    }

    setWorkTime()

    gantt.plugins({
        marker: true,
    })
    gantt.addMarker({
        start_date: new Date(),
        text: '现在',
    })

    // 初始化甘特图
    gantt.init(containerRef.value)

    // entity - "task"|"link"|"resource"|"assignment"
    // action - "create"|"update"|"delete"
    // data - an object with task or link data
    // id – the id of a processed object (task or link)
    // gantt.createDataProcessor((entity, action, data, id) => {
    //     console.debug('gantt event:', { entity, action, id, data })
    //     emit(`${entity}-updated`, id, action, data)
    // })

    for (const event of props.events) {
        gantt.attachEvent(event.event, event.handler, event.settings)
    }
}

function update() {
    console.debug('gantt update')
    const tasks = props.tasks
    if (!props.tasks?.links?.length) {
        tasks.links = generateLinksForTree(
            convertListToTree(props.tasks?.data, {
                id: 'id',
                parentId: 'parent',
                children: 'children',
            })
        )
    }
    // 渲染数据
    gantt.parse(tasks)
    for (const task of tasks.data) {
        gantt.resetProjectDates(task)
    }
    gantt.render()
}

function reset() {
    console.debug('gantt reset')
    // 清空之前的配置
    gantt.clearAll()
    init()
    update()
}

function setWorkTime() {
    gantt.setWorkTime({ day: 0, hours: false })
    gantt.setWorkTime({ day: 6, hours: false })

    gantt.templates.timeline_cell_class = (task, date) => {
        const css = []

        if (!gantt.isWorkTime(date, 'day')) {
            css.push('week-end')
        } else if (!gantt.isWorkTime(date, 'hour')) {
            css.push('no-work-hour')
        }

        return css.join(' ')
    }
}

function hideWeekEnds() {
    gantt.ignore_time = function (date) {
        return !gantt.isWorkTime(date, 'day')
    }
    gantt.render()
}

function hideNotWorkingTime() {
    gantt.ignore_time = function (date) {
        return !gantt.isWorkTime(date)
    }
    gantt.render()
}

const isDark = useDark({
    // onChanged: (dark) => loadSkin(dark),
}) as any

function loadSkin(dark: boolean) {
    const skinCssFile = dark ? 'dhtmlxgantt_contrast_black.css' : 'dhtmlxgantt_material.css'
    const skinCss = new URL(`./assets/skins/${skinCssFile}`, import.meta.url).href

    const link = document.createElement('link')

    link.onload = function () {
        gantt.resetSkin()
        gantt.render()
    }

    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.id = 'gantt-skin'
    link.href = skinCss

    const currentSkinCss = document.getElementById('gantt-skin')
    if (currentSkinCss) {
        document.head.replaceChild(link, currentSkinCss)
    } else {
        document.head.appendChild(link)
    }
}

function applyColumnTemplateFromSlot() {
    // const node = renderSlot(slots, 'columns', { data: props.tasks.data })
}

defineExpose({
    getInstance: () => gantt,
    init,
    update,
    reset,
})
</script>

<template>
    <div ref="containerRef" class="gantt-container" :class="{ 'is-dark': isDark }"></div>
    <div v-show="false">
        <slot name="columns" :data="tasks"></slot>
    </div>
</template>

<style scoped lang="less">
/* stylelint-disable selector-class-pattern */
.gantt-container {
    width: 100%;
    height: 100%;

    ::v-deep(.gantt_layout) {
        .gantt_task {
            .gantt_data_area {
                .gantt_task_row:not(.gantt_selected) {
                    .week-end {
                        background-color: #f2f4f8;
                    }
                }

                .gantt_bars_area {
                    .gantt_task_line {
                        border: none;

                        .gantt_task_content {
                            color: var(--text-color);
                        }
                    }
                }
            }
        }
    }

    &.is-dark {
        ::v-deep(.gantt_layout) {
            background-color: var(--main-bg);

            /** header */
            .gantt_grid_scale,
            .gantt_task_scale {
                // border-bottom: 1px solid var(--border-color);
                background-color: var(--header-bg);

                > * {
                    color: var(--text-color);

                    > * {
                        color: var(--text-color);
                    }
                }
            }

            /** sider */
            .gantt_grid {
                .gantt_grid_scale,
                .gantt_grid_data,
                .gantt_row:not(.gantt_selected) {
                    // border-right: 1px solid var(--border-color);
                    background-color: var(--side-bg);

                    .gantt_cell {
                        color: var(--text-color);
                    }
                }
            }

            /** task */
            .gantt_task {
                .gantt_data_area {
                    .gantt_task_row:not(.gantt_selected) {
                        background-color: var(--main-bg);
                        // color: var(--text-color);
                        .week-end {
                            background-color: #222;
                        }
                    }

                    .gantt_selected {
                        .gantt_task_cell {
                            background-color: var(--highlight-bg);
                        }
                    }
                }
            }
        }
    }
}
</style>
