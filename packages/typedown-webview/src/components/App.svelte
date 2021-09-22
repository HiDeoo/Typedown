<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { isMessage, Message, WebviewMessageError, WebviewMessageInit } from 'typedown-shared'

  import Header from './Header.svelte'
  import Definitions from './Definitions.svelte'
  import { definitions } from '../stores/definitions'

  onMount(() => {
    window.addEventListener('message', onVSCodeMessage)

    const didRestoreDefinitions = definitions.persist()

    if (!didRestoreDefinitions) {
      vscode.postMessage<WebviewMessageInit>({ type: 'init' })
    }
  })

  onDestroy(() => {
    window.removeEventListener('message', onVSCodeMessage)
  })

  function onVSCodeMessage(event: MessageEvent<Message>) {
    if (isMessage(event.data)) {
      switch (event.data.type) {
        case 'import': {
          definitions.set(event.data.definitions)
          break
        }
        default: {
          vscode.postMessage<WebviewMessageError>({
            type: 'error',
            message: `Unknown message type '${event.data.type}' received from VS Code.`,
          })
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
