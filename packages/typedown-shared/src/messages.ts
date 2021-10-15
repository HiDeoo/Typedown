import type { Definitions } from './definitions'

export function isMessage(message: unknown): message is WebviewMessages | VSCodeMessages {
  return message !== null && typeof message === 'object' && typeof (message as Message).type === 'string'
}

type WebviewMessages = WebviewMessageInit | WebviewMessageExport | WebviewMessageError
type VSCodeMessages = VSCodeMessageImport | VSCodeMessageReset

export interface WebviewMessageInit extends Message {
  type: 'init'
}

export interface WebviewMessageExport extends Message {
  type: 'export'
  definitions: Definitions
  headingLevel: number
}

export interface WebviewMessageError extends Message {
  type: 'error'
  message: string
}

export interface VSCodeMessageImport extends Message {
  type: 'import'
  definitions: Definitions
}

export interface VSCodeMessageReset extends Message {
  type: 'reset'
}

export interface Message {
  type: string
}
