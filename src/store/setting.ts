import { defineStore } from 'pinia'
import { SETTING_STORAGE } from '@constants'

interface State {
  editor: {
    tabSize: number
    fontSize: number
    lineHeight: number
    minimap: boolean
    lineNumbers: boolean
  }
  showDescription: boolean
}

export default defineStore(SETTING_STORAGE, {
  state: (): State => {
    return {
      editor: {
        tabSize: 2,
        fontSize: 14,
        lineHeight: 22,
        minimap: false,
        lineNumbers: true
      },
      showDescription: false
    }
  },
  persist: true
})
