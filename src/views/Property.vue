<template>
  <template :key="key" v-for="(property, key) in props.definition">
    <template v-if="store.selectedKeys.indexOf(property.key) !== -1">
      <component
        style="--n-margin: 15px 0 10px 0"
        :is="props.level >= 6 ? NH6 : levelTitleMap[props.level]"
        ># {{ property.label }}</component
      >
      <div v-if="settingStore.showDescription" style="color: #999; margin-bottom: 10px">
        {{ property.description }}
      </div>
      <template key="array" v-if="getInputType(property) === 'array'">
        <div type="array" class="array_property-container">
          <NDynamicTags
            style="--n-input-width: 150px"
            :render-tag="(tag:string,index:number) => renderTag(tag,index,property)"
            :size="'large'"
            :value="store.rawConfig[property.key]"
            @update:value="(event: any) => handleArrayDataItemCheck(event, property)"
          >
          </NDynamicTags>
        </div>
      </template>
      <template key="array" v-if="getInputType(property) === 'array.object'">
        <!-- TODO: handle this case -->
        array.object
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
      <!-- <template key="select.multiple" v-else-if="getInputType(property) === 'select.multiple'">
        <div type="enum" class="enum_property-container">
          <NSelect
            
            :default-value="property.default"
            :options="enumToOptions(property.enum, key as unknown as string)"
            v-model:value="store.rawConfig[property.key]"
          />
        </div>
      </template> -->
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

<script setup lang="ts">
import {
  NH1,
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
  useMessage
} from 'naive-ui'

import { enumToOptions, getInputType } from '../utils'
import useStore from '../store/data'
import useSettingStore from '../store/setting'
import type { Options } from '../types'
import { type Component, h } from 'vue'

export interface Props {
  definition: any
  level: number
}

const levelTitleMap: Record<number, Component> = {
  1: NH2,
  2: NH3,
  3: NH4,
  4: NH5,
  5: NH6
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
function getArrayData(property: Options) {
  if (property.items) {
    const { type } = property.items
    if (type === 'object') {
      store.rawConfig[property.key].map()
    }
  }
}

function handleArrayDataItemCheck(value: string[], property: Options) {
  let _value: any = value
  // check uniqueItems
  if (property.uniqueItems) {
    let inputItem = _value.slice().pop()
    let savedValue = store.rawConfig[property.key]
    if (savedValue && savedValue.indexOf(inputItem) !== -1) {
      return message.warning(`????????? ${inputItem}`)
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
