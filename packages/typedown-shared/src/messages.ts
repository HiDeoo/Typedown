import type * as schemaGenerator from 'ts-json-schema-generator'

export function isMessage(message: unknown): message is WebviewMessages | VSCodeMessages {
  return message !== null && typeof message === 'object' && typeof (message as Message).type === 'string'
}

type WebviewMessages = WebviewMessageReady | WebviewMessageExport
type VSCodeMessages = VSCodeMessageDefinitions

export interface WebviewMessageReady extends Message {
  type: 'ready'
}

export interface WebviewMessageExport extends Message {
  type: 'export'
  definitions: Exclude<schemaGenerator.Schema['definitions'], undefined>
}

export interface VSCodeMessageDefinitions extends Message {
  type: 'definitions'
  schema: schemaGenerator.Schema
}

export interface Message {
  type: string
}
