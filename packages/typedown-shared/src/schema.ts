import type * as TypeDoc from 'typedoc'

export type DefinitionIdentifier = number

export interface Schema extends TypeDoc.JSONOutput.ProjectReflection {
  children: Definition[]
}

export interface Definition extends TypeDoc.JSONOutput.DeclarationReflection {
  id: DefinitionIdentifier
}

export function isSchema(schema: TypeDoc.JSONOutput.ProjectReflection): schema is Schema {
  return typeof schema.children !== 'undefined'
}
