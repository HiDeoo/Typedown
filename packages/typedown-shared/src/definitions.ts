export enum DefinitionKind {
  Interface,
  TypeAlias,
  TypeAliasObjectTypeLiteral,
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

export interface TypeAliasObjectTypeLiteralDefinition extends BaseDefinition {
  children: DefinitionChild[]
  kind: DefinitionKind.TypeAliasObjectTypeLiteral
}

export type Definition = InterfaceDefinition | TypeAliasDefinition | TypeAliasObjectTypeLiteralDefinition
export type Definitions = Definition[]

export function isInterfaceDefinition(definition: Definition): definition is InterfaceDefinition {
  return definition.kind === DefinitionKind.Interface
}

export function isTypeAliasDefinition(definition: Definition): definition is TypeAliasDefinition {
  return definition.kind === DefinitionKind.TypeAlias
}

export function isTypeAliasObjectTypeLiteralDefinition(
  definition: Definition
): definition is TypeAliasObjectTypeLiteralDefinition {
  return definition.kind === DefinitionKind.TypeAliasObjectTypeLiteral
}
