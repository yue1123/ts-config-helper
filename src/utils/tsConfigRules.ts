import type { CompilerOptionName } from '@types'

export const recommended: CompilerOptionName[] = [
  'strict',
  'forceConsistentCasingInFileNames',
  'alwaysStrict',
  'strictNullChecks',
  'strictBindCallApply',
  'strictFunctionTypes',
  'strictPropertyInitialization',
  'noImplicitThis',
  'noImplicitAny',
  'esModuleInterop',
  'skipLibCheck',
  'exactOptionalPropertyTypes'
]

type RootProperties = 'files' | 'extends' | 'include' | 'exclude' | 'references'
type WatchProperties =
  | 'force'
  | 'watchFile'
  | 'watchDirectory'
  | 'fallbackPolling'
  | 'synchronousWatchDirectory'
  | 'excludeFiles'
  | 'excludeDirectories'
type BuildProperties =
  | 'dry'
  | 'force'
  | 'verbose'
  | 'incremental'
  | 'assumeChangesOnlyAffectDirectDependencies'
  | 'traceResolution'

type AnOption = WatchProperties | RootProperties | BuildProperties | CompilerOptionName

/** Allows linking between options */
export const relatedTo: [AnOption, AnOption[]][] = [
  [
    'strict',
    [
      'alwaysStrict',
      'strictNullChecks',
      'strictBindCallApply',
      'strictFunctionTypes',
      'strictPropertyInitialization',
      'noImplicitAny',
      'noImplicitThis',
      'useUnknownInCatchVariables'
    ]
  ],
  ['alwaysStrict', ['strict']],
  ['strictNullChecks', ['strict']],
  ['strictBindCallApply', ['strict']],
  ['strictFunctionTypes', ['strict']],
  ['strictPropertyInitialization', ['strict']],
  ['noImplicitAny', ['strict']],
  ['noImplicitThis', ['strict']],
  ['useUnknownInCatchVariables', ['strict']],

  ['allowSyntheticDefaultImports', ['esModuleInterop']],
  ['esModuleInterop', ['allowSyntheticDefaultImports']],

  ['out', ['outDir', 'outFile']],
  ['outDir', ['out', 'outFile']],
  ['outFile', ['out', 'outDir']],

  ['diagnostics', ['extendedDiagnostics']],
  ['extendedDiagnostics', ['diagnostics']],

  ['experimentalDecorators', ['emitDecoratorMetadata']],
  ['emitDecoratorMetadata', ['experimentalDecorators']],

  ['files', ['include', 'exclude']],
  ['include', ['files', 'exclude']],
  ['exclude', ['include', 'files']],

  ['importHelpers', ['noEmitHelpers', 'downlevelIteration']],
  ['noEmitHelpers', ['importHelpers']],
  ['downlevelIteration', ['importHelpers']],

  ['incremental', ['composite', 'tsBuildInfoFile']],
  ['composite', ['incremental', 'tsBuildInfoFile']],
  ['tsBuildInfoFile', ['incremental', 'composite']],

  ['types', ['typeRoots']],
  ['typeRoots', ['types']],

  ['noLib', ['lib']],
  ['lib', ['noLib']],

  ['allowJs', ['checkJs', 'emitDeclarationOnly']],
  ['checkJs', ['allowJs', 'emitDeclarationOnly']],
  ['declaration', ['declarationDir', 'emitDeclarationOnly']],
  ['declarationDir', ['declaration']],
  ['emitDeclarationOnly', ['declaration']],

  ['moduleResolution', ['module']],
  ['module', ['moduleResolution']],

  ['jsx', ['jsxFactory', 'jsxFragmentFactory', 'jsxImportSource']],
  ['jsxFactory', ['jsx', 'jsxFragmentFactory', 'jsxImportSource']],
  ['jsxFragmentFactory', ['jsx', 'jsxFactory', 'jsxImportSource']],
  ['jsxImportSource', ['jsx', 'jsxFactory']],

  ['suppressImplicitAnyIndexErrors', ['noImplicitAny']],

  ['listFiles', ['explainFiles']],
  ['preserveValueImports', ['isolatedModules', 'importsNotUsedAsValues']]
]

export const relatedToMap = Object.fromEntries(relatedTo)

export const releaseToConfigsMap: { [key: string]: AnOption[] } = {
  '4.7': ['moduleDetection', 'moduleSuffixes'],
  '4.5': ['preserveValueImports'],
  '4.4': ['exactOptionalPropertyTypes', 'useUnknownInCatchVariables'],
  '4.3': ['noImplicitOverride'],
  '4.2': ['noPropertyAccessFromIndexSignature', 'explainFiles'],
  '4.1': ['jsxImportSource', 'noUncheckedIndexedAccess', 'disableFilenameBasedTypeAcquisition'],
  '4.0': ['jsxFragmentFactory', 'disableReferencedProjectLoad'],
  '3.8': [
    'assumeChangesOnlyAffectDirectDependencies',
    'importsNotUsedAsValues',
    'disableSolutionSearching',
    'fallbackPolling',
    'watchDirectory',
    'watchFile'
  ],
  '3.7': [
    'disableSourceOfProjectReferenceRedirect',
    'generateCpuProfile',
    'useDefineForClassFields'
  ],
  '3.5': ['allowUmdGlobalAccess'],
  '3.4': ['incremental', 'tsBuildInfoFile'],
  '3.2': ['strictBindCallApply', 'showConfig'],
  '3.0': ['composite', 'build'],
  '2.9': ['keyofStringsOnly', 'declarationMap'],
  '2.8': ['emitDeclarationOnly'],
  '2.7': ['strictPropertyInitialization', 'esModuleInterop'],
  '2.6': ['strictFunctionTypes'],
  '2.4': ['noStrictGenericChecks'],
  '2.3': ['strict', 'downlevelIteration', 'init', 'checkJs'],
  '2.2': ['jsx'],
  '2.1': ['extends', 'alwaysStrict'],
  '2.0': [
    'declarationDir',
    'skipLibCheck',
    'noUnusedLocals',
    'noUnusedParameters',
    'lib',
    'strictNullChecks',
    'noImplicitThis',
    'rootDirs',
    'traceResolution',
    'include'
  ],
  '1.8': [
    'allowJs',
    'allowSyntheticDefaultImports',
    'allowUnreachableCode',
    'allowUnusedLabels',
    'noImplicitReturns',
    'noFallthroughCasesInSwitch'
  ],
  '1.5': ['inlineSourceMap', 'noEmitHelpers', 'newLine', 'inlineSources', 'rootDir'],
  '1.4': ['noEmitOnError'],
  '1.0': ['declaration', 'target', 'module', 'outFile']
}

/** When a particular compiler flag (or CLI command...) was added  */
export const configReleaseMap: Record<string, string> = {}
Object.keys(releaseToConfigsMap).forEach((v) => {
  releaseToConfigsMap[v].forEach((key) => {
    configReleaseMap[key] = v
  })
})