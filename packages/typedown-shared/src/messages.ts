import type { Definitions } from './definitions'

export function isMessage(message: unknown): message is WebviewMessages | VSCodeMessages {
  return message !== null && typeof message === 'object' && typeof (message as Message).type === 'string'
}

type WebviewMessages = WebviewMessageInit | WebviewMessageExport | WebviewMessageError
type VSCodeMessages = VSCodeMessageImport | VSCodeMessageReload

export interface WebviewMessageInit extends Message {
  type: 'init'
}

export interface WebviewMessageExport extends Message {
  type: 'export'
  definitions: Definitions
}

export interface WebviewMessageError extends Message {
  type: 'error'
  message: string
}

export interface VSCodeMessageImport extends Message {
  type: 'import'
  definitions: Definitions
}

export interface VSCodeMessageReload extends Message {
  type: 'reload'
}

export interface Message {
  type: string
}
