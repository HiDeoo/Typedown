import type * as schemaGenerator from 'ts-json-schema-generator'

export interface VSCodeMessage {
  type: string
}

export interface VSCodeMessageDefinitions extends VSCodeMessage {
  type: 'definitions'
  schema: schemaGenerator.Schema
}

export function isVSCodeMessageDefinitions(message: VSCodeMessage): message is VSCodeMessageDefinitions {
  return (message as VSCodeMessageDefinitions).type === 'definitions'
}
