export type DefinitionIdentifier = number

export type DefinitionChild = [name: string, description: string, type: string, optional: boolean, defaultValue: string]

export interface Definition {
  id: DefinitionIdentifier
  children: DefinitionChild[]
  exported?: boolean
  name: string
}

export type Definitions = Definition[]
