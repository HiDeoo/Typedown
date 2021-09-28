export enum DefinitionKind {
  Interface,
  TypeAlias,
  ObjectTypeAlias,
}

export type DefinitionIdentifier = number

export type DefinitionChild = [name: string, description: string, type: string, optional: boolean, defaultValue: string]

interface BaseDefinition {
  id: DefinitionIdentifier
  description: string
  exported?: boolean
  kind: DefinitionKind
  name: string
}

export interface InterfaceDefinition extends BaseDefinition {
  children: DefinitionChild[]
  kind: DefinitionKind.Interface
}

export interface TypeAliasDefinition extends BaseDefinition {
  kind: DefinitionKind.TypeAlias
  type: string
}

export interface ObjectTypeAliasDefinition extends BaseDefinition {
  children: DefinitionChild[]
  kind: DefinitionKind.ObjectTypeAlias
}

export type Definition = InterfaceDefinition | TypeAliasDefinition | ObjectTypeAliasDefinition
export type Definitions = Definition[]

export function isInterfaceDefinition(definition: Definition): definition is InterfaceDefinition {
  return definition.kind === DefinitionKind.Interface
}

export function isTypeAliasDefinition(definition: Definition): definition is TypeAliasDefinition {
  return definition.kind === DefinitionKind.TypeAlias
}

export function isObjectTypeAliasDefinition(definition: Definition): definition is ObjectTypeAliasDefinition {
  return definition.kind === DefinitionKind.ObjectTypeAlias
}
