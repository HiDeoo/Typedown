export interface WebviewMessage {
  type: string
}

export interface WebviewMessageReady extends WebviewMessage {
  type: 'ready'
}

export function isWebviewMessageReady(message: unknown): message is WebviewMessageReady {
  return isWebviewMessage(message) && (message as WebviewMessageReady).type === 'ready'
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
