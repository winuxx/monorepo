import { GanttConfigOptions, Task, Link, GanttEventName, GridColumn } from 'dhtmlx-gantt'

export type GanttOptions = Partial<GanttConfigOptions>

export interface GanttTasks {
    data: Task[]
    links?: Link[]
}

export interface GanttEventItem {
    event: GanttEventName
    handler: (...args: any[]) => any
    settings?: object
}

export function generateLinksForTree(tasks: Task[], parent = null, links: Link[] = []) {
    for (const task of tasks) {
        if (parent) {
            links.push({
                id: task.id + '_' + parent.id,
                source: parent.id,
                target: task.id,
                type: '1',
                color: '#d0e0f0',
                // lag: 1,
                readonly: true,
            })
        }
        if (task.children) {
            generateLinksForTree(task.children, task, links)
        }
    }
    return links
}

export type { Task, GridColumn }
