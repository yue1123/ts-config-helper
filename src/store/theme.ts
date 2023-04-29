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
  persist: import.meta.env.VITE_APP_SHOULD_CATCH_DATA === 'true' || import.meta.env.PROD
})
