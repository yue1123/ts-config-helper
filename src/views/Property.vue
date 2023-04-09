<script setup lang="ts">
import {
  NH2,
  NH3,
  NH4,
  NH5,
  NH6,
  NTag,
  NDynamicTags,
  NSwitch,
  NInput,
  NSelect,
  useMessage,
  NButton,
  NInputNumber,
  NTooltip
} from 'naive-ui'
import { BIconHash, BIconLink45deg } from 'bootstrap-icons-vue'
import { descriptionMap } from '@schema'
import KeyValuesInput from '@components/KeyValuesInput.vue'
import ObjectInput from '@components/ObjectInput.vue'
import MarkdownDesc from './MarkdownDesc.vue'
import { enumToOptions, getInputType } from '../utils'
import useStore from '../store/data'
import useSettingStore from '../store/setting'
import type { Options } from '../types'
import { type Component, h, ref } from 'vue'
import { currentLang } from '@i18n'
export interface Props {
  definition: any
  level: number
}
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
        store.rawConfig[property.key].splice(index, 1)
      }
    },
    {
      default: () => tag
    }
  )
}

// handle arrayButConvertWhenSingle input type
function handleTagsChange(value: string[], property: Options) {
  store.rawConfig[property.key] = value.length === 1 ? value[0] : value
}

function handleArrayDataItemCheck(value: string[], property: Options) {
  let _value: any = value
  // check uniqueItems
  if (property.uniqueItems) {
    let inputItem = _value.slice().pop()
    let savedValue = store.rawConfig[property.key]
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
  store.rawConfig[property.key] = _value
}
</script>

<script lang="ts">
export default {
  name: 'Property'
}
</script>

<template>
  <template :key="key" v-for="(property, key) in props.definition">
    <template v-if="store.selectedKeys.indexOf(property.key) !== -1">
      <div class="mt-3 flex items-center space-x-4">
        <div class="flex justify-start items-center space-x-2">
          <NButton size="small" text>
            <template #icon>
              <BIconHash />
            </template>
          </NButton>
          <div class="flex items-center keys">
            <template v-for="(key, index) in property.parentKeys" :key="index">
              <NH4 style="color: #bbb; --n-margin: 0">{{ key }}</NH4>
              <span> . </span>
            </template>
            <NH3 style="--n-margin: 0">{{ property.label }}</NH3>
          </div>
        </div>
        <template v-if="descriptionMap[currentLang][property.key].link">
          <NTooltip placement="right" trigger="hover">
            <template #trigger>
              <NButton
                text
                tag="a"
                :href="descriptionMap[currentLang][property.key].link"
                target="_blank"
                type="default"
              >
                <template #icon>
                  <BIconLink45deg />
                </template>
              </NButton>
            </template>
            文档链接
          </NTooltip>
        </template>
        <Suspense>
          <MarkdownDesc :property="property.label" />
        </Suspense>
      </div>
      <div class="text-gray-400 mb-1" v-if="property.default !== undefined">
        {{ $t('defaultValue') }}: {{ property.default }}
      </div>
      <div v-if="settingStore.showDescription" class="text-gray-400 mb-2">
        {{ descriptionMap[currentLang][property.key].message }}
      </div>
      <template key="array" v-if="getInputType(property) === 'array'">
        <div type="array" class="array_property-container">
          <NDynamicTags
            style="--n-input-width: 150px"
            :render-tag="(tag:string,index:number) => renderTag(tag,index,property)"
            :size="'large'"
            :value="store.rawConfig[property.key]"
            @update:value="(event: any) => handleArrayDataItemCheck(event, property)"
          />
        </div>
      </template>
      <template key="array" v-if="getInputType(property) === 'keyValues'">
        <KeyValuesInput
          :data="store.rawConfig[property.key]"
          @update:data="(data) => (store.rawConfig[property.key] = data)"
          key-desc="alias path"
          value-desc="alias target"
        />
      </template>
      <template key="boolean" v-else-if="getInputType(property) === 'boolean'">
        <div type="boolean" class="boolean_property-container">
          <NSwitch v-model:value="store.rawConfig[property.key]" />
        </div>
      </template>
      <template key="string" v-else-if="getInputType(property) === 'string'">
        <div type="string" class="string_property-container">
          <NInput v-model:value="store.rawConfig[property.key]" />
        </div>
      </template>
      <template key="select" v-else-if="getInputType(property) === 'select'">
        <div type="enum" class="enum_property-container">
          <NSelect
            :multiple="property.type === 'array'"
            :default-value="property.default"
            :options="enumToOptions(property.enum, key as unknown as string)"
            v-model:value="store.rawConfig[property.key]"
          />
        </div>
      </template>
      <template key="select.multiple" v-else-if="getInputType(property) === 'array.object'">
        <ObjectInput
          :property="property"
          :data="store.rawConfig[property.key]"
          @update:data="(data) => (store.rawConfig[property.key] = data)"
        ></ObjectInput>
      </template>
      <template key="number" v-else-if="getInputType(property) === 'number'">
        <NInputNumber v-model:value="store.rawConfig[property.key]" />
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
              typeof store.rawConfig[property.key] === 'string'
                ? [store.rawConfig[property.key]]
                : store.rawConfig[property.key]
            "
            @update:value="(event: any) => handleTagsChange(event, property)"
          />
        </div>
      </template>
      <template
        key="selectOrInputWithCheck"
        v-else-if="getInputType(property) === 'selectOrInputWithCheck'"
      >
        <div type="selectOrInputWithCheck" class="enum_property-container">123</div>
      </template>
    </template>
    <template v-if="property.children.length">
      <Property :level="props.level + 1" :definition="property.children" />
    </template>
  </template>
</template>
