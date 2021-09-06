import App from './App.svelte'
import type { WebviewMessage } from 'typedown-messages'

const app = new App({
  target: document.getElementById('app') as HTMLElement,
})

export default app

declare global {
  const vscode: {
    postMessage<T extends WebviewMessage>(message: T): void
  }
}
