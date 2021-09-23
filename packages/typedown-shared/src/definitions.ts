export type DefinitionIdentifier = number

export type DefinitionChild = [name: string, type: string]

export interface Definition {
  id: DefinitionIdentifier
  children: DefinitionChild[]
  exported?: boolean
  name: string
}

export type Definitions = Definition[]
