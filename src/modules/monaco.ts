import { getCurrentInstance, onMounted } from 'vue'
import * as monaco from 'monaco-editor'

const setup = async () => {
  await Promise.all([
    // load workers
    (async () => {
      const [{ default: EditorWorker }, { default: JsonWorker }] = await Promise.all([
        import('monaco-editor/esm/vs/editor/editor.worker?worker'),
        import('monaco-editor/esm/vs/language/json/json.worker?worker')
      ])

      self.MonacoEnvironment = {
        getWorker(_: any, label: string) {
          if (label === 'json') return new JsonWorker()
          return new EditorWorker()
        }
      }
    })()
  ])

  if (getCurrentInstance()) await new Promise<void>((resolve) => onMounted(resolve))
}

export default setup

setup()
