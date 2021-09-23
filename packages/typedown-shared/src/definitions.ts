export type DefinitionIdentifier = number

export type DefinitionChild = [name: string, type: string, optional: boolean]

export interface Definition {
  id: DefinitionIdentifier
  children: DefinitionChild[]
  exported?: boolean
  name: string
}

export type Definitions = Definition[]
