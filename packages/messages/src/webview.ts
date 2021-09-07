import type * as schemaGenerator from 'ts-json-schema-generator'

export interface WebviewMessage {
  type: string
}

export interface WebviewMessageReady extends WebviewMessage {
  type: 'ready'
}

export interface WebviewMessageExport extends WebviewMessage {
  type: 'export'
  definitions: Exclude<schemaGenerator.Schema['definitions'], undefined>
}

export function isWebviewMessageReady(message: unknown): message is WebviewMessageReady {
  return isWebviewMessage(message) && (message as WebviewMessageReady).type === 'ready'
}

export function isWebviewMessageExport(message: unknown): message is WebviewMessageExport {
  return isWebviewMessage(message) && (message as WebviewMessageExport).type === 'export'
}

function isWebviewMessage(message: unknown): message is WebviewMessage {
  const webviewMessage = message as WebviewMessage

  return (
    message !== null &&
    typeof message === 'object' &&
    typeof webviewMessage.type !== 'undefined' &&
    typeof webviewMessage.type === 'string'
  )
}
