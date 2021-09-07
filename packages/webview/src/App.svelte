<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { isVSCodeMessageDefinitions, VSCodeMessage, WebviewMessageReady } from 'typedown-messages'

  import { definitions } from './stores/definition'

  onMount(() => {
    window.addEventListener('message', onVSCodeMessage)

    vscode.postMessage<WebviewMessageReady>({ type: 'ready' })
  })

  onDestroy(() => {
    window.removeEventListener('message', onVSCodeMessage)
  })

  function onVSCodeMessage(event: MessageEvent<VSCodeMessage>) {
    if (isVSCodeMessageDefinitions(event.data)) {
      definitions.setSchema(event.data.schema)
    }
  }
</script>

<main>
  <h1>Hello</h1>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
      'Helvetica Neue', sans-serif;
  }
</style>
