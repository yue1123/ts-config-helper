import {
  frontmatterReg,
  markdownHashLinkReg,
  markdownNoBaseUrlLinkReg,
  tsConfigSite,
  tsConfigSiteRef
} from '@constants'
import { twoSlasher } from './plugins/twoslash'
// import Shikiji from 'markdown-it-shikiji'
// import { transformerTwoslash } from 'vitepress-plugin-twoslash'
// const md = MarkdownIt()
// import { transformerTwoSlash } from 'shikiji-twoslash'
export async function createMarkdownRenderer() {
  const [{ default: markdownIt }, { default: hljs }, { default: javascript }, { default: json }] =
    await Promise.all([
      import('markdown-it'),
      import('highlight.js/lib/core'),
      import('highlight.js/lib/languages/javascript'),
      import('highlight.js/lib/languages/json')
    ])

  hljs.registerLanguage('json', json)
  hljs.registerLanguage('javascript', javascript)

  const md = markdownIt({
    html: true,
    xhtmlOut: true,
    breaks: true,
    linkify: true,
    typographer: true,
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

  // md.use(
  //   await Shikiji({
  //     themes: {
  //       light: 'vitesse-light',
  //       dark: 'vitesse-dark'
  //     },
  //     transformers: [transformerTwoSlash()]
  //   })
  // )
  md.use(twoSlasher)

  return (content: string) => {
    content = content
      // remove formatter
      .replace(frontmatterReg, '')
      // hash link add base url
      .replace(markdownHashLinkReg, (all, hash) => all.replace(hash, `${tsConfigSiteRef}${hash}`))
      // add base url
      .replace(markdownNoBaseUrlLinkReg, (all, link) => all.replace(link, `${tsConfigSite}${link}`))
    return md.render(content)
  }
}
