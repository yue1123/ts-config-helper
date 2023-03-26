import markdownIt from 'markdown-it'
import hljs from 'highlight.js'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import json from 'highlight.js/lib/languages/json'

import 'highlight.js/styles/base16/material-darker.css'

export function createMarkdownRenderer() {
  hljs.registerLanguage('json', json)
  hljs.registerLanguage('typescript', typescript)
  hljs.registerLanguage('javascript', javascript)
  const frontmatterReg = /---[\w\W]*?---/im
  const mdRender = markdownIt({
    highlight(str, lang, attrs) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, {
            language: lang
          }).value
        } catch (__) {}
      }

      return ''
    }
  })
  return (content: string) => mdRender.render(content.replace(frontmatterReg, ''))
}
