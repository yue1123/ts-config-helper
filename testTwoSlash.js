const { twoslasher } = require('@typescript/twoslash')

const a = `
\`\`\`ts twoslash
// @errors: 7028
// @allowUnusedLabels: false
function verifyAge(age: number) {
  // Forgot 'return' statement
  if (age > 18) {
    verified: true;
  }
}
\`\`\`
`
console.log(twoslasher(a, 'ts'))
