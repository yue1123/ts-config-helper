import markdownIt from 'markdown-it'
import hljs from 'highlight.js'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import json from 'highlight.js/lib/languages/json'
import {
  frontmatterReg,
  markdownHashLinkReg,
  markdownNoBaseUrlLinkReg,
  tsConfigSite,
  tsConfigSiteRef
} from '@constants'

export function createMarkdownRenderer() {
  hljs.registerLanguage('json', json)
  hljs.registerLanguage('typescript', typescript)
  hljs.registerLanguage('javascript', javascript)

  const md = markdownIt({
    html: true,
    xhtmlOut: true,
    breaks: true,
    linkify: true,
    typographer: true,
    highlight(str, lang) {
      console.log(lang)
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
