import { ref } from 'vue'
import { currentLang } from '@i18n'
import { createMarkdownRenderer } from '@modules/markdown'

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
const cache = new Map()
export async function usePropertyRemoteMarkdown() {
  const mdRender = await createMarkdownRenderer()
  const isLoading = ref<boolean>(false)
  const data = ref<string>()
  const get = (property: string) => {
    const catchKey = `${currentLang.value}:${property}`
    const res = cache.get(catchKey) || cache.get(property)
    if (res) return Promise.resolve((data.value = res))
    else if (res === null) {
      isLoading.value = false
      return Promise.reject(null)
    }
    const currentLangMarkdownUrl = `https://cdn.jsdelivr.net/gh/yue1123/TypeScript-Website-Localizations@1.0.0-alpha.1/docs/tsconfig/${currentLang.value}/options/${property}.md`
    const fallbackDescUrl = `https://cdn.jsdelivr.net/gh/yue1123/TypeScript-Website@1.0.0-alpha.1/packages/tsconfig-reference/copy/en/options/${property}.md`
    isLoading.value = true
    return new Promise<string>((resolve, reject) => {
      fetchMarkdown(currentLangMarkdownUrl)
        .catch((errResponse) => {
          if (errResponse.status === 404) {
            return fetchMarkdown(fallbackDescUrl)
          } else {
            reject(errResponse)
          }
        })
        .then((res) => {
          data.value = mdRender(res!)
          cache.set(catchKey, data.value)
          resolve(data.value)
        })
        .catch((errResponse) => {
          if (errResponse.status === 404) {
            cache.set(property, null)
          }
          reject(errResponse)
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
