import type { Definition, Schema } from './schema'

export function isMessage(message: unknown): message is WebviewMessages | VSCodeMessages {
  return message !== null && typeof message === 'object' && typeof (message as Message).type === 'string'
}

type WebviewMessages = WebviewMessageInit | WebviewMessageExport
type VSCodeMessages = VSCodeMessageImport

export interface WebviewMessageInit extends Message {
  type: 'init'
}

export interface WebviewMessageExport extends Message {
  type: 'export'
  definitions: Definition[]
}

export interface VSCodeMessageImport extends Message {
  type: 'import'
  schema: Schema
}

export interface Message {
  type: string
}
