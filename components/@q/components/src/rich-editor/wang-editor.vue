<template>
    <div class="rich-editor">
        <Toolbar
            class="editor-toolbar"
            :editor="editorRef"
            :default-config="defaultToolbarConfig"
            :mode="mode"
        />
        <Editor
            v-model="valueRef"
            :default-config="editorConfig"
            :mode="mode"
            class="editor-textarea"
            @on-created="handleCreated"
            @on-change="handleChange"
        />
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css'
import { useVModel } from '@vueuse/core'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'

const mode = 'simple' // mode: 'default', 'simple'

const props = defineProps({
    value: {
        type: String,
        default: () => '',
    },
    height: {
        type: String,
        default: () => '',
    },
    defaultToolbarConfig: { type: Object, default: () => ({}) },
    defaultEditorConfig: { type: Object, default: () => ({}) },
})

const valueRef = useVModel(props, 'value')

// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef()

const editorConfig = computed(() =>
    Object.assign(
        {},
        {
            placeholder: '请粘贴图片或输入内容...',
        },
        props.defaultEditorConfig
    )
)
// 内容 HTML
// const valueHtml = ref('<p>hello</p>')

// 模拟 ajax 异步获取内容
onMounted(() => {
    // setTimeout(() => {
    //     valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
    // }, 1500)
})

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return

    editor.destroy()
})

// 编辑器回调函数
const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}
const handleChange = (editor) => {
    // console.log('change:', editor.getHtml())
    valueRef.value = editor.getHtml()
}
const handleDestroyed = (editor) => {
    console.log('destroyed', editor)
}
const handleFocus = (editor) => {
    console.log('focus', editor)
}
const handleBlur = (editor) => {
    console.log('blur', editor)
}
const customAlert = (info, type) => {
    alert(`【自定义提示】${type} - ${info}`)
}
const customPaste = (editor, event, callback) => {
    console.log('ClipboardEvent 粘贴事件对象', event)

    // 自定义插入内容
    // editor.insertText('xxx')

    // 返回值（注意，vue 事件的返回值，不能用 return）
    // callback(false) // 返回 false ，阻止默认粘贴行为
    callback(true) // 返回 true ，继续默认的粘贴行为
}

const insertText = () => {
    const editor = editorRef.value
    if (editor == null) return

    editor.insertText('hello world')
}

const printHtml = () => {
    const editor = editorRef.value
    if (editor == null) return
    console.log(editor.getHtml())
}

const disable = () => {
    const editor = editorRef.value
    if (editor == null) return
    editor.disable()
}
</script>

<style lang="less" scoped>
.w-e-full-screen-container {
    top: 60px !important;
}

.rich-editor {
    display: flex;
    // min-height: 400px;
    height: v-bind(height);
    flex-direction: column;
    border: 1px solid #e0e0e0;

    ::v-deep(.w-e-bar.w-e-toolbar) {
        border-bottom: 1px solid #e0e0e0;
        border-bottom: var(--el-border);
        background-color: var(--el-input-bg-color);
        color: var(--el-input-text-color);

        .w-e-bar-item {
            padding: 0;
        }

        .w-e-bar-divider {
            background-color: var(--el-border-color);
        }

        .w-e-modal {
            top: 8px;
            bottom: 0;
        }

        // .w-e-bar-show {
        //     background-color: #f2f2f2;
        // }
    }

    .editor-textarea {
        // flex: 1;
        // min-height: 400px;
        overflow-y: hidden;

        ::v-deep(.w-e-text-container) {
            // min-height: 100%;
            background-color: var(--el-input-bg-color);
            color: var(--el-input-text-color);
        }
    }
}
</style>
