import { defineStore } from 'pinia'
import { THEME } from '@constants'

interface State {
  isDark: boolean
}

export default defineStore(THEME, {
  state: (): State => {
    return {
      isDark: true
    }
  },
  persist: true
})
