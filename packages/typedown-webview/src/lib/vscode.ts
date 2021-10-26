import type { Message } from 'typedown-shared'

const vscode = acquireVsCodeApi()

export default vscode

declare global {
  const acquireVsCodeApi: () => {
    getState<T>(): T
    postMessage<T extends Message>(message: T): void
    setState<T>(state: T): void
  }
}
