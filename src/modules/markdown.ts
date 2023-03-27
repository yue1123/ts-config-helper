import markdownIt from 'markdown-it'
// import { markdownItShikiTwoslashSetup } from 'markdown-it-shiki-twoslash'
// import Shiki from 'markdown-it-shiki'
import { remarkVisitor } from 'remark-shiki-twoslash'
type Highlighter = Parameters<typeof import('remark-shiki-twoslash').remarkVisitor>[0][0]
// import { createDefaultMapFromCDN } from '@typescript/vfs'
import theme from './a.json'
import ts from 'typescript'

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
  let a = ''
  //    {
  //   // @ts-ignore
  //   theme: twoslashTheme,
  //   tsModule: ts,
  //   lzstringModule: sandbox.lzstring as any,
  //   fsMap
  // }
  let highlighter: Highlighter | undefined

  // Grab Shiki from unpkg and set up a shiki highlighter.
  const getShiki = document.createElement('script')
  getShiki.src = 'https://unpkg.com/shiki'
  getShiki.async = true
  getShiki.onload = async () => {
    // @ts-ignore
    const shiko: typeof import('shiki') = window.shiki
    shiko.setCDN('https://unpkg.com/shiki/')
    highlighter = await shiko.getHighlighter({ themes: [theme as any], langs: ['ts'] })
    // @ts-ignore - this is an implementation detail inside remark-shiki-twoslash
    highlighter.customName = 'web'
    // if (reTriggerTwoslash) reTriggerTwoslash()

  }
  document.body.appendChild(getShiki)
  // const mapWithLibFiles = await createDefaultMapFromCDN({ target: 3 }, '4.3.5', true, ts)
  // Sets up an fs map which uses the TS sandbox type definitions
  // const fsMap = new Map<string, string>(mapWithLibFiles)

  // @ts-ignore
  // const ataTypes: Record<string, string> = window.typeDefinitions || {}
  // Object.keys(ataTypes).forEach((f) => {
  // if (f.startsWith('file:/')) {
  // fsMap.set(f.replace('file:///', '/'), ataTypes[f])
  // }
  // })
  console.log(ts);
  const runner = remarkVisitor([], {
    // @ts-ignore
    theme: theme,
    tsModule: ts
    // lzstringModule: sandbox.lzstring as any,
    // fsMap
  })
  // console.log(fsMap)
  console.log(runner)
  const node = {
    lang: 'ts',
    meta: 'twoslash',
    type: 'custom',
    value:
      "/**\n *\n * @param {(...arg) => void} fn 回调函数\n * @param {number} wait 等待时间 \n * @param {boolean} immediate 是否立即出发\n */\nexport function debounce(fn: (...arg: any[]) => any, wait: number, immediate: boolean = false) {\n  if (typeof fn !== 'function') throw new Error('must have a callback fn')\n  if (typeof wait === 'boolean') immediate = wait\n  if (wait === undefined || typeof wait !== 'number') wait = 300\n}\n",
    children: []
  }
  console.log(node)

  runner(node)
  // console.log(node)
  a = node.value
  // console.log(a)

  return () => a
  // if (node.value) {
  //   const editedForWeb = node.value.replace('<p>Raising Code:</p>', '')
  // }

  // const shiki = await markdownItShikiTwoslashSetup({
  //   theme: 'nord'
  // })
  // , {
  //   theme: {
  //     dark: 'min-dark',
  //     light: 'min-light'
  //   }
  // }
  // md.use(shiki)
  return (content: string) => md.render(content.replace(frontmatterReg, ''))
}
