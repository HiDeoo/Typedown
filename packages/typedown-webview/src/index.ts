import App from './components/App.svelte'

import 'modern-normalize/modern-normalize.css'

const app = new App({
  target: document.getElementById('app') as HTMLElement,
})

export default app
