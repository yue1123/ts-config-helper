import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import App from './App.vue'
import { setupI18n } from '@i18n'
import '@modules/monaco'
import '@modules/baiduAnalysis'
import '@styles/main.css'
import { createMarkdownRenderer } from '@modules/markdown-it'
const mdRender = await createMarkdownRenderer()

const app = createApp(App)
const store = createPinia()
setupI18n().then((i18n) => {
  app.use(i18n)
  app.mount('#app')
})
app.use(autoAnimatePlugin)
app.use(store)
store.use(piniaPluginPersistedstate)

// import { renderers } from 'shiki-twoslash'
// // import { transformerTwoSlash } from 'shikiji-twoslash'

// // ;(async () => {
// //   const html = await codeToHtml(`console.log()`, {
// //   lang: 'ts',
// //   theme: 'vitesse-dark',
// //   transformers: [
// //     transformerTwoSlash() // <-- here
// //     // ...
// //   ]
// // })
// // console.log(html)
// // })()
// import { renderers, renderCodeToHTML } from 'shiki-twoslash'
// // import { createTwoSlashFromCDN } from 'twoslash-cdn'
// import { getHighlighter, setCDN } from 'shiki'
// // import { renderCodeToHTML, runTwoSlash } from 'shiki-twoslash'
// import { createDefaultMapFromCDN } from '@typescript/vfs'
// import ts from 'typescript'
// import { setupTypeAcquisition } from '@typescript/ata'
// import lzstring from 'lz-string'
// import './twoslash.css'
// import darkPlus from './dark-plus.json'

// import { createTwoSlashFromCDN } from './twoslashCore'
// // const highlighter = await getHighlighter({
// //   langs: ['ts'],
// //   theme: 'dark-plus'
// // })
// // console.log(highlighter)
// // const twoslash = createTwoSlashFromCDN()

// const code = `
// // @noImplicitAny: false
// // This will not throw because of the noImplicitAny
// function fn(s) {
//   console.log(s.subtr(3))
// }

// fn(42);
// `
// const { runSync, run } = createTwoSlashFromCDN({
//   compilerOptions: {
//     lib: ['esnext', 'dom']
//   }
// })
// setCDN('https://unpkg.com/shiki/')
// const highlighter = await getHighlighter({
//   theme: 'github-dark',
//   themes: ['github-dark'],
//   langs: ['ts', 'js']
// })
// const newResults = await run(code, 'ts')
// const codeAsFakeShikiTokens = newResults.code.split('\n').map((line) => [{ content: line }])
// const html = renderers.twoslashRenderer(
//   codeAsFakeShikiTokens,
//   {
//     themeName: 'github-dark'
//   },
//   newResults as any,
//   {}
// )
// const html = renderCodeToHTML(
//   code,
//   'ts',
//   { twoslash: true },
//   { themeName: 'github-dark', theme: 'github-dark' },
//   highlighter,
//   newResults
// )

// document.body.innerHTML = html

// const fsMap = new Map<string, string>()
// let initPromise: Promise<void> | undefined

// const prepareTypes = setupTypeAcquisition({
//   projectName: 'twoslash-cdn',
//   typescript: ts,
//   // fetcher,
//   delegate: {
//     receivedFile: (code: string, path: string) => {
//       fsMap.set(path, code)
//     }
//   }
// })

// async function _init() {
//   const newMap = await createDefaultMapFromCDN(
//     {
//       lib: ['esnext', 'dom']
//     },
//     ts.version,
//     false,
//     ts,
//     lzstring
//   )

//   newMap.forEach((value, key) => {
//     fsMap.set(key, value)
//   })
// }

// function init() {
//   if (!initPromise) initPromise = _init()
//   return initPromise
// }
// init().then(async () => {
//   await prepareTypes(code)
//   const newResults = runTwoSlash(code, 'ts', {
//     tsModule: ts,
//     fsMap: fsMap,
//     lzstringModule: lzstring
//   })

//   const codeAsFakeShikiTokens = newResults.code.split('\n').map((line) => [{ content: line }])
//   const html = renderers.twoslashRenderer(
//     codeAsFakeShikiTokens,
//     {
//       themeName: 'github-dark'
//     },
//     newResults as any,
//     {}

//   )
// })
