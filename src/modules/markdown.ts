import markdownIt from 'markdown-it'
import linkAttr from 'markdown-it-link-attributes'
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

export async function createMarkdownRenderer() {
  hljs.registerLanguage('json', json)
  hljs.registerLanguage('typescript', typescript)
  hljs.registerLanguage('javascript', javascript)

  const md = markdownIt('commonmark', {
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
  md.use(linkAttr, {
    pattern: /^https?:/,
    attrs: {
      target: '_blank',
      rel: 'noopener'
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
