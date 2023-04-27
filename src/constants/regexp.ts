// match markdown frontmatter reg
export const frontmatterReg = /---[\w\W]*?---/im

// match markdown hash link
export const markdownHashLinkReg = /\[.+?\]\((#.+?)\)/g

// markdown link no base url
export const markdownNoBaseUrlLinkReg = /\[.+?\]\((\/.+?)\)/g

// match number
export const numberReg = /(\d+)/g

// match letter
export const letterReg = /[a-zA-Z]/
/**
 * @example "strict": true ==test==> true
 * @example "strict": true ==match==> strict
 */
export const propertyLineReg = /"([a-zA-Z]+)"\s*:/


export const dotReg = /\./g