import { describe, expect, it, vi } from 'vitest'
import { getParentKeyByNestedPropertyLineContent } from '../getParentKeyByNestedPropertyLineContent'

const json = `{ "display": "Create React App", "compilerOptions": { "lib": [ "dom", "dom.iterable", "esnext" ], "module": "esnext", "target": "es2015", "allowJs": true, "allowSyntheticDefaultImports": true, "esModuleInterop": true, "forceConsistentCasingInFileNames": true, "isolatedModules": true, "jsx": "react-jsx", "moduleResolution": "node", "noEmit": true, "noFallthroughCasesInSwitch": true, "resolveJsonModule": true, "skipLibCheck": true, "strict": true } }`

// let lineContent = `    "jsx": "react-jsx",`

describe('getParentKeyByNestedPropertyLineContent', () => {
  it('property line: `    "jsx": "react-jsx",`', () => {
    let lineContent = `    "jsx": "react-jsx",`
    expect(getParentKeyByNestedPropertyLineContent(json, lineContent)).toBe('compilerOptions.jsx')
  })
  it('leaf line: `  "compilerOptions": {`', () => {
    let lineContent = `  "compilerOptions": {`
    expect(getParentKeyByNestedPropertyLineContent(json, lineContent)).toBe('compilerOptions')
  })
  it('array inside: `"dom.iterable",`', () => {
    let lineContent = `  "dom.iterable",`
    expect(getParentKeyByNestedPropertyLineContent(json, lineContent)).toBe('compilerOptions.lib')
  })
})
