import markdownIt from 'markdown-it'
// import { markdownItShikiTwoslashSetup } from 'markdown-it-shiki-twoslash'
import Shiki from 'markdown-it-shiki'

import hljs from 'highlight.js'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import json from 'highlight.js/lib/languages/json'

import 'highlight.js/styles/base16/material-darker.css'

export async function createMarkdownRenderer() {
  hljs.registerLanguage('json', json)
  hljs.registerLanguage('typescript', typescript)
  hljs.registerLanguage('javascript', javascript)
  const frontmatterReg = /---[\w\W]*?---/im
  const md = markdownIt({
    highlight(str, lang) {
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
  // const shiki = await markdownItShikiTwoslashSetup({
  //   theme: 'nord'
  // })
  md.use(Shiki, {
    theme: {
      dark: 'min-dark',
      light: 'min-light'
    }
  })
  return (content: string) => md.render(content.replace(frontmatterReg, ''))
}
