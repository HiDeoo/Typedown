import type { Definitions } from './definitions'

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
  definitions: Definitions
}

export interface VSCodeMessageImport extends Message {
  type: 'import'
  definitions: Definitions
}

export interface Message {
  type: string
}
