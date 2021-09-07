import App from './App.svelte'
import type { Message } from 'typedown-shared'

const app = new App({
  target: document.getElementById('app') as HTMLElement,
})

export default app

declare global {
  const vscode: {
    getState<T>(): T
    postMessage<T extends Message>(message: T): void
    setState<T>(state: T): void
  }
}
