// prettier-ignore
import type { UserConfigSettings } from "shiki-twoslash"
import type { Highlighter } from 'shiki'
import type MarkdownIt from 'markdown-it'

import { setupForFile, transformAttributesToHTML } from 'remark-shiki-twoslash'
console.log(setupForFile)
/* Uses deasync to _try_ and give a synchronous API to the markdown-it parser */
// const MarkdownItShikiTwoslash: MarkdownIt.PluginWithOptions<UserConfigSettings> = (
//   markdownit,
//   options: UserConfigSettings = {}
// ) => {
//   let highlighters: Highlighter[] | undefined = undefined
//   setupForFile(options).then((h) => (highlighters = h.highlighters))
//   if (!highlighters) {
//     let count = 10000 / 200
//     while (!highlighters) {
//       count -= 1
//       if (count <= 0) throw new Error('Shiki - highlightersFromSettings() never gets resolved')
//     }
//   }

//   markdownit.options.highlight = (code, lang, attrs) => {
//     return transformAttributesToHTML(code, [lang, attrs].join(' '), highlighters!, options)
//   }
// }

// prettier-ignore

/** An async version of the default markdown-it plugin */
export const markdownItShikiTwoslashSetup = async (settings: UserConfigSettings): Promise<MarkdownIt.PluginWithOptions<UserConfigSettings>> => {
  const { highlighters } = await setupForFile(settings)

  return (markdownit, options) => {
    markdownit.options.highlight = (code, lang, attrs) => {
      code = code.replace(/\r?\n$/, "") // strip trailing newline fed during code block parsing
      return transformAttributesToHTML(code, [lang, attrs].join(" "), highlighters, options!)
    }
  }
}
// export default MarkdownItShikiTwoslash
