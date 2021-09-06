import App from './App.svelte'

const app = new App({
  target: document.getElementById('app') as HTMLElement,
})

export default app

declare global {
  const vscode: {
    postMessage(message: unknown): void
  }
}
