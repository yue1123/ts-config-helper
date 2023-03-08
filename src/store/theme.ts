import { defineStore } from 'pinia'

interface State {
  isDark: boolean
}

export default defineStore('theme', {
  state: (): State => {
    return {
      isDark: true
    }
  }
})
