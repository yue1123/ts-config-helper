<script setup lang="ts">
import KeyValuesInput from '@components/KeyValuesInput.vue'
import ObjectInput from '@components/ObjectInput.vue'
import { currentLang } from '@i18n'
import { descriptionMap } from '@schema'
import useStore from '@store/data'
import useRuntimeStore from '@store/runtime'
import useSettingStore from '@store/setting'
import type { Options } from '@types'
import { enumToOptions, getInputType } from '@utils'
import { BIconHash, BIconLink45deg } from 'bootstrap-icons-vue'
import {
  NButton,
  NDynamicTags,
  NH3,
  NH4,
  NInput,
  NInputNumber,
  NSelect,
  NSwitch,
  NTag,
  NTooltip,
  useMessage
} from 'naive-ui'
import { dotReg } from '@constants'
import { h, nextTick, watch } from 'vue'
import MarkdownDesc from './MarkdownDesc.vue'
import ExtendsAutoComplete from './ExtendsAutoComplete.vue'
// props type
export interface Props {
  definition: Options[]
  level: number
}
const runtimeStore = useRuntimeStore()
const store = useStore()
const settingStore = useSettingStore()
const message = useMessage()
const props = defineProps<Props>()

function renderTag(tag: string, index: number, property: Options) {
  return h(
    NTag,
    {
      closable: true,
      size: 'large',
      onClose: () => {
        store.rawConfig[property.flatKeys].splice(index, 1)
      }
    },
    {
      default: () => tag
    }
  )
}

// handle arrayButConvertWhenSingle input type
function handleTagsChange(value: string[], property: Options) {
  store.rawConfig[property.flatKeys] = value.length === 1 ? value[0] : value
}

function handleArrayDataItemCheck(value: string[], property: Options) {
  let _value: any = value
  // check uniqueItems
  if (property.uniqueItems) {
    let inputItem = _value.slice().pop()
    let savedValue = store.rawConfig[property.flatKeys]
    if (savedValue && savedValue.indexOf(inputItem) !== -1) {
      return message.warning(`已存在 ${inputItem}`)
    }
  }
  // data type check
  if (property.items) {
    const { type } = property.items
    if (Array.isArray(type) && type.includes('number')) {
      _value = value.map((item) => +item ?? item)
    }
  }
  store.rawConfig[property.flatKeys] = _value
}
// 点击锚点或相关属性左侧复选框滚动到视口中
function handleScrollToTargetOptions(property: Options, relatedKey?: string) {
  const key = relatedKey
    ? [...property.parentKeys, relatedKey].join('\\.')
    : property.flatKeys.replace(dotReg, '\\.')
  const targetOptionEl: HTMLElement | null = document.querySelector(`#J_Options_Container #${key}`)
  const collapseKey = property.parentKeys.join('.')
  const hasKey = runtimeStore.collapseExpandedNames.includes(collapseKey)
  if (!hasKey) {
    runtimeStore.collapseExpandedNames.push(collapseKey)
  }
  if (targetOptionEl) {
    setTimeout(
      () => {
        targetOptionEl.focus()
        targetOptionEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      },
      hasKey ? 0 : 200
    )
  }
}
// 递归组件,只需要第一次渲染监听
// 聚焦 key改变,可视面板滚动到视口
if (props.level === 1) {
  // 锚点
  watch(
    () => runtimeStore.currentCurserLineFlatKey,
    (newKey) => {
      nextTick(() => {
        if (newKey) {
          const targetOptionEl: HTMLElement | null = document.querySelector(
            `#visualization-container #${newKey.replace(dotReg, '\\.')}`
          )
          if (targetOptionEl) {
            setTimeout(() => {
              targetOptionEl.focus()
              targetOptionEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
            })
          }
        }
      })
    }
  )
}
</script>

<script lang="ts">
export default {
  name: 'Property'
}
</script>

<template>
  <template :key="key" v-for="(property, key) in props.definition">
    <template v-if="store.selectedKeys.includes(property.flatKeys)">
      <div
        class="mb-4 property-item"
        :class="{ 'focus-key': property.flatKeys === runtimeStore.currentCurserLineFlatKey }"
      >
        <div class="flex items-center space-x-4">
          <div class="flex items-center justify-start space-x-1" :id="property.flatKeys">
            <NButton
              class="hash-btn"
              size="small"
              text
              @click="handleScrollToTargetOptions(property)"
            >
              <template #icon>
                <BIconHash />
              </template>
            </NButton>
            <div class="flex items-center keys">
              <template v-for="(key, index) in property.parentKeys" :key="index">
                <NH4 style="color: #bbb; --n-margin: 0">{{ key }}</NH4>
                <span> . </span>
              </template>
              <NH3 style="--n-margin: 0">{{ property.key }}</NH3>
            </div>
          </div>
          <template v-if="descriptionMap[currentLang][property.flatKeys]?.link">
            <NTooltip placement="right" trigger="hover">
              <template #trigger>
                <NButton
                  text
                  tag="a"
                  :href="descriptionMap[currentLang][property.flatKeys].link"
                  target="_blank"
                  class="opacity-40 hover:opacity-100"
                  type="default"
                >
                  <template #icon>
                    <BIconLink45deg />
                  </template>
                </NButton>
              </template>
              {{ $t('docLink') }}
            </NTooltip>
          </template>
          <Suspense>
            <MarkdownDesc
              @scrollToTargetOptions="
                (relatedKey) => handleScrollToTargetOptions(property, relatedKey)
              "
              :property="property.key"
            />
          </Suspense>
        </div>
        <div class="mb-1 text-gray-400" v-if="property.default !== undefined">
          {{ $t('default') }}: {{ property.default }}
        </div>
        <div v-if="settingStore.showDescription" class="mb-2 text-gray-400">
          {{ descriptionMap[currentLang][property.flatKeys]?.message }}
        </div>
        <template key="array" v-if="getInputType(property) === 'array'">
          <div type="array" class="array_property-container">
            <NDynamicTags
              style="--n-input-width: 150px"
              :render-tag="(tag:string,index:number) => renderTag(tag,index,property)"
              :size="'large'"
              :value="store.rawConfig[property.flatKeys]"
              @update:value="(event: any) => handleArrayDataItemCheck(event, property)"
            />
          </div>
        </template>
        <template key="array" v-if="getInputType(property) === 'keyValues'">
          <KeyValuesInput
            :data="store.rawConfig[property.flatKeys]"
            @update:data="(data) => (store.rawConfig[property.flatKeys] = data)"
            key-desc="alias path"
            value-desc="alias target"
          />
        </template>
        <template key="boolean" v-else-if="getInputType(property) === 'boolean'">
          <div type="boolean" class="boolean_property-container">
            <NSwitch v-model:value="store.rawConfig[property.flatKeys]" />
          </div>
        </template>
        <template key="string" v-else-if="getInputType(property) === 'string'">
          <div type="string" class="string_property-container">
            <NInput v-model:value="store.rawConfig[property.flatKeys]" />
          </div>
        </template>
        <template key="select" v-else-if="getInputType(property) === 'select'">
          <div type="enum" class="enum_property-container">
            <NSelect
              :multiple="property.type === 'array'"
              :default-value="property.default"
              :options="enumToOptions(property.enum, key as unknown as string)"
              v-model:value="store.rawConfig[property.flatKeys]"
            />
          </div>
        </template>
        <template key="select.multiple" v-else-if="getInputType(property) === 'array.object'">
          <ObjectInput
            :property="property"
            :data="store.rawConfig[property.flatKeys]"
            @update:data="(data) => (store.rawConfig[property.flatKeys] = data)"
          ></ObjectInput>
        </template>
        <template key="number" v-else-if="getInputType(property) === 'number'">
          <NInputNumber v-model:value="store.rawConfig[property.flatKeys]" />
        </template>
        <template key="extendsProperty" v-else-if="property.key === 'extends'">
          <ExtendsAutoComplete
            :value="
              typeof store.rawConfig[property.flatKeys] === 'string'
                ? [store.rawConfig[property.flatKeys]]
                : store.rawConfig[property.flatKeys]
            "
            @update:value="(event: any) => handleTagsChange(event, property)"
          />
        </template>
        <template
          key="arrayButConvertWhenSingle"
          v-else-if="getInputType(property) === 'arrayButConvertWhenSingle'"
        >
          <div type="arrayButConvertWhenSingle" class="enum_property-container">
            <NDynamicTags
              style="--n-input-width: 150px"
              :size="'large'"
              :value="
                typeof store.rawConfig[property.flatKeys] === 'string'
                  ? [store.rawConfig[property.flatKeys]]
                  : store.rawConfig[property.flatKeys]
              "
              @update:value="(event: any) => handleTagsChange(event, property)"
            />
          </div>
        </template>
      </div>
    </template>
    <template v-if="property.children.length">
      <Property :level="props.level + 1" :definition="property.children" />
    </template>
  </template>
</template>

<style lang="scss" scoped>
.property-item .hash-btn {
  border: 2px solid transparent;
}
.property-item.focus-key .hash-btn {
  border: 2px solid #ffdc34;
  border-radius: 4px;
}
</style>
