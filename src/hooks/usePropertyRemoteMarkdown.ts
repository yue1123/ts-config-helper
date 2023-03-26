import { ref } from 'vue'
import { currentLang } from '@i18n'
import { createMarkdownRenderer } from '@modules/markdown'

const cache = new Map()

function fetchMarkdown(url: string) {
  return fetch(url, {
    mode: 'cors'
  }).then((response) => {
    if (response.ok) {
      return response.text()
    }
    throw response
  })
}
const mdRender = createMarkdownRenderer()
export function usePropertyRemoteMarkdown() {
  const isLoading = ref<boolean>(false)
  const data = ref<string>()
  const get = (property: string) => {
    const catchKey = `${currentLang.value}:${property}`
    const res = cache.get(catchKey)
    if (res) return Promise.resolve((data.value = res))
    const currentLangMarkdownUrl = `https://cdn.jsdelivr.net/gh/yue1123/TypeScript-Website-Localizations@1.0.0-alpha.1/docs/tsconfig/${currentLang.value}/options/${property}.md`
    const fallbackDescUrl = `https://cdn.jsdelivr.net/gh/yue1123/TypeScript-Website@1.0.0-alpha.1/packages/tsconfig-reference/copy/en/options/${property}.md`
    isLoading.value = true
    return new Promise<string>((resolve, reject) => {
      fetchMarkdown(currentLangMarkdownUrl)
        .catch((errResponse) => {
          if (errResponse.status === 404) {
            return fetchMarkdown(fallbackDescUrl)
          }
          reject(errResponse)
        })
        .then((res) => {
          data.value = mdRender(res!)
          cache.set(catchKey, data.value)
          resolve(data.value)
        })
        .finally(() => {
          isLoading.value = false
        })
    })
  }

  return {
    get,
    data,
    isLoading
  }
}
