import type MarkdownIt from 'markdown-it'
import type { Plugin } from 'vite'
import { createTwoSlashFromCDN } from './twoslash'
type Append = Record<'headers' | 'footers' | 'scriptSetups', string[]>

export function twoSlasher(md: MarkdownIt) {
  const { runSync, run, renderToHtml } = createTwoSlashFromCDN({
    compilerOptions: {
      lib: ['esnext', 'dom']
    }
  })
  md.use(function (md) {
    const fence = md.renderer.rules.fence!
    md.renderer.rules.fence = (...args) => {
      const [tokens, idx] = args
      const token = tokens[idx]
      const { tag, info, content } = token
      const twoslashInfo = 'ts twoslash'

      if (tag === 'code' && info === twoslashInfo) {
        token.attrs = [['sub-type', 'twoslash']]
        console.log('type', token)
      }
      const twoslashCodeBlockId = `twoslash-${Date.now() + idx}`
      const twoslashCodeBlockReg =
        /<pre><code sub-type="twoslash" class="language-ts">([\w\W]*?)<\/code><\/pre>/gim

      let rawCode = fence(...args)
      // console.log(twoslash.run(content))
      console.log('render', twoslashCodeBlockId)
      //       const result = await twoslash.run(`
      //   import { ref } from 'vue'
      //   const count = ref(0)
      //   //     ^?
      // `)
      //       console.log(result)
      let htmlCode = ''
      renderToHtml(content).then((html) => {
        htmlCode = html
        const twoslashCodeBlockEl = document.getElementById(twoslashCodeBlockId)
        console.log(html)
        console.log(twoslashCodeBlockEl, 'el')
        if (twoslashCodeBlockEl) {
          twoslashCodeBlockEl.innerHTML = html
        }
      })

      rawCode = rawCode.replace(
        twoslashCodeBlockReg,
        `<div id="${twoslashCodeBlockId}">
          ${
            htmlCode ||
            `<div style="height: 100px; width: 100%; background: #f90; line-height:100px;text-align: center;">twoslash loading...</div>`
          }
        </div>`
      )
      return `${rawCode}`
    }
  })
}
