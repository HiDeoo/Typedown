import { Definitions, Schema } from './definitions'

export function isMessage(message: unknown): message is WebviewMessages | VSCodeMessages {
  return message !== null && typeof message === 'object' && typeof (message as Message).type === 'string'
}

type WebviewMessages = WebviewMessageInit | WebviewMessageExport
type VSCodeMessages = VSCodeMessageDefinitions

export interface WebviewMessageInit extends Message {
  type: 'init'
}

export interface WebviewMessageExport extends Message {
  type: 'export'
  definitions: Definitions
}

export interface VSCodeMessageDefinitions extends Message {
  type: 'definitions'
  schema: Schema
}

export interface Message {
  type: string
}
