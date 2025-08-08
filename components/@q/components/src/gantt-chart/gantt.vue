<script setup lang="ts">
import { GanttEventItem, GanttOptions, GanttTasks } from './gantt-chart-tools'
import GanttChart from './gantt-chart.vue'

const tasks = ref<GanttTasks>({
    data: [
        { id: 1, text: 'Task #1', start_date: new Date('2024-02-17'), duration: 3, progress: 0.6 },
        { id: 2, text: 'Task #2', start_date: new Date('2024-02-22'), duration: 3, progress: 0.4 },
        { id: 3, text: 'Task #3', start_date: new Date('2024-02-25'), duration: 3, progress: 0.4 },
        { id: 4, text: 'Task #4', start_date: new Date('2024-02-28'), duration: 3, progress: 0.4 },
        { id: 5, text: 'Task #5', start_date: new Date('2024-03-01'), duration: 3, progress: 0.4 },
    ],
    links: [{ id: 1, source: 1, target: 2, type: '0' }],
})

const options: GanttOptions = {
    scale_unit: 'week',
}

const events: GanttEventItem[] = [
    {
        event: 'onTaskClick',
        handler: (id, PointerEvent) => {
            console.log('onTaskClick', id, PointerEvent)
            return true
        },
    },
    {
        event: 'onTaskSelected',
        handler: (...args) => {
            console.log('onTaskSelected', args)
        },
    },
    {
        event: 'onBeforeTaskAdd',
        handler: (...args) => {
            console.log('onTaskSelected', args)
        },
    },
]
</script>

<template>
    <div class="task-gantt">
        <GanttChart :tasks="tasks" :options="options" :events="events" />
    </div>
</template>

<style scoped lang="less">
.task-gantt {
    height: 100%;
}
</style>
