// match markdown frontmatter reg
export const frontmatterReg = /---[\w\W]*?---/im

// match markdown hash link
export const markdownHashLinkReg = /\[.+?\]\((#.+?)\)/g

// markdown link no base url
export const markdownNoBaseUrlLinkReg = /\[.+?\]\((\/.+?)\)/g
