<template>
  <div ref="codeEditBox" class="codeEditBox"></div>
</template>
​
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch, defineExpose, watchEffect, nextTick } from 'vue'
import * as monaco from 'monaco-editor'
import useThemeStore from '../store/theme'
import useDataStore from '../store/data'
import useSettingStore from '../store/setting'
// import es from '../schema/_tsconfig.json?url'
// import zh from '../schema/_tsconfig.zh.json?url'
export interface Props {
  modelValue?: string
  language: string
  theme: 'vs' | 'vs-dark' | 'hc-black'
  options?: Record<string, any>
  width?: string
  height?: string
  local: any
}
// const schemaJsonMap = {
//   'en-US': es,
//   zh_cn: zh
// }
const emit = defineEmits(['update:modelValue', 'change', 'editor-mounted'])
const props = defineProps<Props>()
const themeStore = useThemeStore()
const settingStore = useSettingStore()
const dataStore = useDataStore()
let editor: monaco.editor.IStandaloneCodeEditor | null = null
const codeEditBox = ref()
let shouldEmitChange = true
const init = () => {
  // 定义主题
  monaco.editor.defineTheme('darkTheme', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#101014'
    }
  })
  monaco.editor.defineTheme('lightTheme', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#ffffff'
    }
  })
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    enableSchemaRequest: true,
    allowComments: false,
    schemas: [
      {
        fileMatch: ['*'],
        uri: 'https://json.schemastore.org/tsconfig'
      }
    ]
  })
  const { tabSize, fontSize, lineHeight, minimap, lineNumbers } = settingStore.editor
  editor = monaco.editor.create(codeEditBox.value, {
    value: props.modelValue,
    language: props.language,
    theme: themeStore.isDark ? 'darkTheme' : 'lightTheme',
    automaticLayout: false,
    domReadOnly: true,
    scrollbar: {
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8
    },
    suggest: {
      preview: true
    },
    fontSize,
    lineHeight,
    tabSize,
    insertSpaces: true,
    lineNumbers: lineNumbers ? 'on' : 'off',
    minimap: {
      enabled: minimap
    },
    ...props.options
  })
  // 绑定“Ctrl+Z”键为撤销操作
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ, function () {
    // console.log('撤销')
    editor?.trigger('keyboard', 'undo', null)
  })

  // 绑定“Ctrl+Y”键为重做操作
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY, function () {
    // console.log('重做')
    editor?.trigger('keyboard', 'redo', null)
  })
  // 监听值的变化
  editor.onDidChangeModelContent(() => {
    if (!shouldEmitChange) return
    const value = editor!.getValue() //给父组件实时返回最新文本
    dataStore.config = value
    emit('update:modelValue', value)
    emit('change', value)
  })
  emit('editor-mounted', editor)
  // sync value
  dataStore.config = props.modelValue || ''
}

watchEffect(() => {
  const { tabSize, fontSize, lineHeight, minimap, lineNumbers } = settingStore.editor
  if (!editor) return
  editor.updateOptions({
    fontSize,
    lineHeight,
    tabSize,
    lineNumbers: lineNumbers ? 'on' : 'off',
    minimap: {
      enabled: minimap
    }
  })
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (editor) {
      let value = editor.getValue()
      if (newValue !== value) {
        shouldEmitChange = false
        const model = editor.getModel()
        const position = editor.getPosition()
        if (model) {
          editor.pushUndoStop()
          editor.setValue((newValue as string) || '')
          position && editor.setPosition(position)
        }
        nextTick(() => (shouldEmitChange = true))
      }
    }
  }
)
watch(
  () => props.options,
  (newValue) => {
    editor!.updateOptions(newValue || {})
  },
  { deep: true }
)
watch(
  () => themeStore.isDark,
  (isDark) => {
    monaco.editor.setTheme(isDark ? 'darkTheme' : 'lightTheme')
  }
)
onBeforeUnmount(() => editor && editor.dispose())
onMounted(init)

function resize() {
  if (!editor) return
  editor.layout()
}

defineExpose({
  resize
})
</script>

<script lang="ts">
export default {
  name: 'MonacoEditor'
}
</script>

<style scoped>
.codeEditBox {
  width: v-bind(width);
  height: v-bind(height);
}
:deep(.monaco-editor .margin),
:deep(.monaco-editor-background) {
  transition: background-color 0.3s var(--n-bezier), background-color 0.3s var(--n-bezier),
    box-shadow 0.3s var(--n-bezier), border-color 0.3s var(--n-bezier);
}
</style>
