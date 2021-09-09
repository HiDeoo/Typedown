import type * as schemaGenerator from 'ts-json-schema-generator'

export function isSchema(schema: schemaGenerator.Schema): schema is Schema {
  return typeof schema.definitions !== 'undefined'
}

export interface Schema extends schemaGenerator.Schema {
  definitions: {
    [key: string]: Definition
  }
}

export type Definitions = Exclude<Exclude<schemaGenerator.Schema, undefined>['definitions'], undefined>
export type Definition = Definitions[keyof Definitions] & { selected?: boolean }
