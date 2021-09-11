import type * as TypeDoc from 'typedoc'

export type DefinitionIdentifier = number

export interface Definition extends TypeDoc.JSONOutput.DeclarationReflection {
  id: DefinitionIdentifier
}

export type Definitions = Definition[]
