<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { isMessage, Message, WebviewMessageReady } from 'typedown-shared'

  import Header from './components/Header.svelte'
  import Definitions from './components/Definitions.svelte'
  import { definitions } from './stores/definition'

  onMount(() => {
    window.addEventListener('message', onVSCodeMessage)

    vscode.postMessage<WebviewMessageReady>({ type: 'ready' })
  })

  onDestroy(() => {
    window.removeEventListener('message', onVSCodeMessage)
  })

  function onVSCodeMessage(event: MessageEvent<Message>) {
    if (isMessage(event.data)) {
      switch (event.data.type) {
        case 'definitions': {
          definitions.setSchema(event.data.schema)
          break
        }
        default: {
          console.error('Unknown message type received from VS Code.')
          break
        }
      }
    }
  }
</script>

<Header />
<Definitions />

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
      'Helvetica Neue', sans-serif;
  }
</style>
