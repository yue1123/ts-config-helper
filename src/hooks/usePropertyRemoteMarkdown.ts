import { ref } from 'vue'
import { currentLang } from '@i18n'
import { createMarkdownRenderer } from '@modules/markdown'
import { request } from '@utils'

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
    const currentLangMarkdownUrl = `https://cdn.jsdelivr.net/gh/microsoft/TypeScript-Website-Localizations@HEAD/docs/tsconfig/${currentLang.value}/options/${property}.md`
    const fallbackDescUrl = `https://cdn.jsdelivr.net/gh/microsoft/TypeScript-Website@HEAD/packages/tsconfig-reference/copy/en/options/${property}.md`
    isLoading.value = true
    return new Promise<string>((resolve, reject) => {
      request(currentLangMarkdownUrl)
        .catch((errResponse) => {
          if (errResponse.status === 404) {
            return request(fallbackDescUrl)
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
