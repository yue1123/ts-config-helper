import { defineStore } from 'pinia'
import { GUIDE } from '@constants'

interface State {
  isFirst: boolean
}

export default defineStore(GUIDE, {
  state: (): State => {
    return {
      isFirst: true
    }
  },
  persist: false
})
