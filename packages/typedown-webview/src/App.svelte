<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { isMessage, Message, WebviewMessageInit } from 'typedown-shared'

  import Header from './components/Header.svelte'
  import Definitions from './components/Definitions.svelte'
  import { definitions } from './stores/definition'
  import { getSchemaFromState } from './state'

  onMount(() => {
    window.addEventListener('message', onVSCodeMessage)

    const schema = getSchemaFromState()

    if (schema) {
      definitions.setSchema(schema)
    } else {
      vscode.postMessage<WebviewMessageInit>({ type: 'init' })
    }
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
    cursor: default;
  }

  :global(body) {
    padding: 0;
  }
</style>
