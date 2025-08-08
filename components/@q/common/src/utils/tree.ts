interface TreeOption {
    id: string
    parentId: string
    ancestorIds?: string
    children: string
    numberTo?: string
}

const defaultOption: TreeOption = {
    id: 'id',
    parentId: 'parentId',
    ancestorIds: 'ancestorIds',
    children: 'children',
}

type ListItem<T> = T & {
    id?: string | number
    parentId?: string | number
} & Record<string, any>

type TreeNode<T> = T & {
    id?: string | number
    children?: TreeNode<T>[]
} & Record<string, any>

function getRootNodes<T>(list: ListItem<T>[], option: TreeOption): TreeNode<T>[] {
    const rootNodes: TreeNode<T>[] = []
    let i = 0
    for (const it of list as any[]) {
        const parentId = it[option.parentId]
        // note: 如果一条数据有parentId，但对应的node并不存在，则这条数据也识别为rootNode
        const isRoot =
            (!parentId && parentId !== 0) || !list.some((it1) => parentId === it1[option.id])
        if (isRoot) {
            if (option.numberTo) {
                i += 1
                it[option.numberTo] = i
            }
            rootNodes.push(it)
        }
    }
    return rootNodes
}

function getChildrenOfNodeOld<T>(
    parent: TreeNode<T>,
    list: ListItem<T>[],
    option: TreeOption = defaultOption
): TreeNode<T>[] {
    const idKey = option.id
    const pidKey = option.parentId
    const parentId = parent[idKey]
    const children = [] as TreeNode<T>[]
    let i = 0
    for (const it of list as any[]) {
        if (it[pidKey] === parentId) {
            const nodeList = getChildrenOfNodeOld(it, list, option)
            if (nodeList.length > 0) {
                it[option.children] = nodeList
            }
            if (option.numberTo) {
                i += 1
                it[option.numberTo] = parent[option.numberTo] + '.' + i
            }
            children.push(it)
        }
    }
    return children
}

function buildTreeNode<T>(
    node: TreeNode<T>,
    map: Map<string | number, ListItem<T>[]>,
    option: TreeOption = defaultOption
): TreeNode<T> {
    const id = node[option.id]
    return {
        ...node,
        [option.children]: map.get(id)?.map((child, index) => buildTreeNode(child, map, option)),
    }
}

function getChildrenOfNode<T>(
    node: TreeNode<T>,
    map: Map<string | number, ListItem<T>[]>,
    option: TreeOption = defaultOption
): TreeNode<T>[] | undefined {
    const id = node[option.id]
    return map.get(id)?.map((child: any, index) => {
        if (option.numberTo) {
            child[option.numberTo] = node[option.numberTo] + '.' + (index + 1)
        }
        child[option.ancestorIds || defaultOption.ancestorIds] = [
            ...(node[option.ancestorIds] ?? []),
            id,
        ]
        return {
            ...child,
            [option.children]: getChildrenOfNode(child, map, option),
        }
    })
}

export function getParentOfNode<T>(
    parentId: string | number,
    tree: TreeNode<T>[],
    option: TreeOption = defaultOption
): TreeNode<T> | null {
    const idKey = option.id
    // const pidKey = option.parentId
    for (const node of tree) {
        if (node[idKey] === parentId) {
            return node
        } else {
            if (!node[option.children]) continue
            const parentNode = getParentOfNode(parentId, node[option.children], option)
            if (parentNode) {
                return parentNode as TreeNode<T>
            }
        }
    }
    return null
}

function generateParentMap<T>(list: ListItem<T>[], option: TreeOption = defaultOption) {
    const map: Map<string | number, ListItem<T>[]> = new Map()
    list.forEach((it) => {
        const parentId = it[option.parentId]
        if (parentId) {
            if (!map.has(parentId)) {
                map.set(parentId, [])
            }
            map.get(parentId)?.push(it)
        }
    })
    return map
}
export function convertListToTree<T>(
    list: ListItem<T>[],
    option: TreeOption = defaultOption
): TreeNode<T>[] {
    const map = generateParentMap(list, option)
    const rootNodes = getRootNodes(list, option)
    return rootNodes.map((it) => ({
        ...it,
        [option.children]: getChildrenOfNode(it, map, option),
    }))
}

interface FlatableTreeOption {
    id?: string
    parentId?: string
    children: string
}

const defaultFlatableOption: FlatableTreeOption = {
    children: 'children',
}

/**
 * note: children字段必须
 * @param tree TreeNode[]
 * @param option
 * @returns
 */
export function convertTreeToList<T>(
    tree: TreeNode<T>[],
    option: FlatableTreeOption = defaultFlatableOption,
    keepChildren?: boolean,
    parent?: TreeNode<T>
): ListItem<T>[] {
    const list = [] as ListItem<T>[]
    for (const node of tree as any[]) {
        if (parent && option.id && option.parentId && parent[option.id]) {
            node[option.parentId] = parent[option.id]
            node.parentNode = parent
        }
        if (node[option.children]) {
            const { [option.children]: children, ...newNode } = node
            if (keepChildren && children) {
                newNode[option.children] = children
            }
            list.push(newNode as ListItem<T>)
            list.push(...convertTreeToList(children, option, keepChildren, node))
        } else {
            list.push(node)
        }
    }
    return list
}
