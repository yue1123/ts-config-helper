<template>
  <div ref="codeEditBox" class="codeEditBox"></div>
</template>
​
<script setup lang="ts">
import {
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  defineExpose,
  getCurrentInstance,
  watchEffect,
  nextTick
} from 'vue'
import * as monaco from 'monaco-editor'
import useThemeStore from '../store/theme'
import useDataStore from '../store/data'
import useSettingStore from '../store/setting'
import es from '../schema/_tsconfig.json?url'
import zh from '../schema/_tsconfig.zh.json?url'
export interface Props {
  modelValue?: string
  language: string
  theme: 'vs' | 'vs-dark' | 'hc-black'
  options?: Record<string, any>
  width?: string
  height?: string
  local: any
}
const schemaJsonMap = {
  'en-US': es,
  zh_cn: zh
}
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
    editor?.trigger('keyboard', 'undo', null)
  })

  // 绑定“Ctrl+Y”键为重做操作
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY, function () {
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
watchEffect(() => {
  let url = (schemaJsonMap as any)[props.local]
  if (!url) url = (schemaJsonMap as any)['en-US']
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    enableSchemaRequest: true,
    allowComments: false,
    schemas: [
      {
        // fileMatch: ['tsconfig.*.json', 'tsconfig.json'],
        fileMatch: ['*'],
        uri: new URL(url, import.meta.url).href
      }
    ]
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
        // let numberRegexp = /\d+/gs
        // const formatAction = editor.getAction('editor.action.formatDocument')
        // const oldValueObj = parse(value)
        // const newValueObj = parse(newValue!)
        // const patch = compare(oldValueObj, newValueObj)
        // patch.forEach(({ path, value: _newValue }: any) => {
        //   let pathArr = path.split('/').filter((path: string) => {
        //     return path && !numberRegexp.test(path)
        //   })
        //   console.log(pathArr)
        //   value = applyEdits(value, modify(value, pathArr, store.rawConfig[pathArr.join('/')], {}))
        // })
        // const formatPatch = format(value, undefined, {
        //   tabSize: 2
        // })
        // model && model.setValue(applyEdits(value, formatPatch))
        model && model.setValue((newValue as string) || '')

        // formatAction && formatAction.run()
        position && editor.setPosition(position)
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
// watch(
//   () => props.language,
//   (newValue) => {
//     monaco.editor.setModelLanguage(editor!.getModel()!, newValue)
//   }
// )
watch(
  () => themeStore.isDark,
  (isDark) => {
    monaco.editor.setTheme(isDark ? 'darkTheme' : 'lightTheme')
  }
)
onBeforeUnmount(() => editor!.dispose())
onMounted(init)

function resize() {
  if (!editor) return
  editor.layout()
}

// function registerDocumentFormattingEditProviders() {
//   const disposables: monaco.IDisposable[] = []

//   const formattingEditProvider = {
//     async provideDocumentFormattingEdits(model, _options, _token) {
//       // if (!prettierWorker) {
//       //   prettierWorker = createWorkerQueue(PrettierWorker)
//       // }
//       // const { canceled, error, pretty } = await prettierWorker.emit({
//       //   text: model.getValue(),
//       //   language: model.getLanguageId()
//       // })
//       // if (canceled || error) return []
//       console.log('format')
//       return [
//         {
//           range: model.getFullModelRange(),
//           text: model.getValue()
//         }
//       ]
//     }
//   }

//   disposables.push(
//     monaco.languages.registerDocumentFormattingEditProvider('json', formattingEditProvider)
//   )

//   return {
//     dispose() {
//       disposables.forEach((disposable) => disposable.dispose())
//     }
//   }
// }

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
