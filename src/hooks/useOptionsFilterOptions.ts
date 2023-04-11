import type { FilterKey } from '@types'
import type { DropdownOption } from 'naive-ui'
import { ref, computed, type Component, h } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  BIconLightningFill,
  BIconBoxes,
  BIconCodeSlash,
  BIconFiletypeJs,
  BIconGrid,
  BIconStarFill,
  BIconTerminal,
  BIconStack,
  BIconBoundingBoxCircles,
  BIconLayoutTextWindowReverse,
  BIconLifePreserver,
  BIconListColumns,
  BIconPlug,
  BIconUiChecksGrid
} from 'bootstrap-icons-vue'
export function useOptionsFilterOptions() {
  const { t } = useI18n({ useScope: 'global' })

  const filterLabelMap = computed<Record<FilterKey, string>>(() => ({
    all: t('sidebar.all'),
    common: t('sidebar.common'),
    typeChecking: t('sidebar.typeChecking'),
    modules: t('sidebar.modules'),
    emit: t('sidebar.emit'),
    javaScriptSupport: t('sidebar.javaScriptSupport'),
    editorSupport: t('sidebar.editorSupport'),
    interopConstraints: t('sidebar.interopConstraints'),
    backwardsCompatibility: t('sidebar.backwardsCompatibility'),
    languageEnvironment: t('sidebar.languageEnvironment'),
    compilerDiagnostics: t('sidebar.compilerDiagnostics'),
    projects: t('sidebar.projects'),
    outputFormatting: t('sidebar.outputFormatting'),
    completeness: t('sidebar.completeness')
  }))
  const renderIcon = (icon: Component) => {
    return () => h(icon, null)
  }
  const filterOptions = computed<DropdownOption[]>(() => {
    return [
      {
        label: t('sidebar.all'),
        key: 'all',
        icon: renderIcon(BIconGrid)
      },
      {
        label: t('sidebar.common'),
        key: 'common',
        icon: renderIcon(BIconStarFill)
      },
      {
        type: 'divider'
      },
      {
        label: t('sidebar.more'),
        key: 'others',
        icon: renderIcon(BIconUiChecksGrid),
        children: [
          {
            label: t('sidebar.dropdown.typeChecking'),
            key: 'typeChecking',
            icon: renderIcon(BIconLightningFill)
          },
          {
            label: t('sidebar.dropdown.modules'),
            key: 'modules',
            icon: renderIcon(BIconBoxes)
          },
          {
            label: t('sidebar.dropdown.emit'),
            key: 'emit',
            icon: renderIcon(BIconCodeSlash)
          },
          {
            label: t('sidebar.dropdown.javaScriptSupport'),
            key: 'javaScriptSupport',
            icon: renderIcon(BIconFiletypeJs)
          },
          {
            label: t('sidebar.dropdown.editorSupport'),
            key: 'editorSupport',
            icon: renderIcon(BIconLayoutTextWindowReverse)
          },
          {
            label: t('sidebar.dropdown.interopConstraints'),
            key: 'interopConstraints',
            icon: renderIcon(BIconBoundingBoxCircles)
          },
          {
            label: t('sidebar.dropdown.backwardsCompatibility'),
            key: 'backwardsCompatibility',
            icon: renderIcon(BIconPlug)
          },
          {
            label: t('sidebar.dropdown.languageEnvironment'),
            key: 'languageEnvironment',
            icon: renderIcon(BIconTerminal)
          },
          {
            label: t('sidebar.dropdown.projects'),
            key: 'projects',
            icon: renderIcon(BIconStack)
          },
          {
            label: t('sidebar.dropdown.outputFormatting'),
            key: 'outputFormatting',
            icon: renderIcon(BIconListColumns)
          },
          {
            label: t('sidebar.dropdown.completeness'),
            key: 'completeness',
            icon: renderIcon(BIconLifePreserver)
          }
        ]
      }
    ]
  })
  return { filterLabelMap, filterOptions }
}
