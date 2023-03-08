export interface Options {
  label: string
  key: string
  default: any
  type: any
  enum: string[]
  items: any
  oneOf?: any[]
  anyOf?: any[]
  uniqueItems?: boolean
  properties: Record<string, any>
  children: Options[]
}
