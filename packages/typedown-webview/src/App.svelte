<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { isMessage, Message, WebviewMessageInit } from 'typedown-shared'

  import Header from './components/Header.svelte'
  import Schema from './components/Schema.svelte'
  import { definitions } from './stores/definitions'
  import { schema } from './stores/schema'

  onMount(() => {
    window.addEventListener('message', onVSCodeMessage)

    const didRestoreSchema = schema.persist()
    definitions.persist()

    if (!didRestoreSchema) {
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
          schema.set(event.data.schema)
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
<Schema />

<style>
  :root {
    cursor: default;
  }

  :global(body) {
    padding: 0;
  }
</style>
