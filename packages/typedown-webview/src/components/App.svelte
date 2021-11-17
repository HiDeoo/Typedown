<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { isMessage, Message, WebviewMessageError, WebviewMessageInit } from 'typedown-shared'

  import Header from './Header.svelte'
  import Definitions from './Definitions.svelte'
  import { definitions } from '../stores/definitions'
  import { filter } from '../stores/filters'
  import { scrollY } from '../stores/position'
  import vscode from '../lib/vscode'

  onMount(() => {
    window.addEventListener('message', onVSCodeMessage)

    const didRestoreDefinitions = definitions.persist()
    const didRestoreScrollY = scrollY.persist()
    filter.persist()

    if (!didRestoreDefinitions) {
      vscode.postMessage<WebviewMessageInit>({ type: 'init' })
    }

    if (didRestoreScrollY) {
      requestAnimationFrame(() => {
        window.scrollTo(0, $scrollY)
      })
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
        case 'reset': {
          definitions.reset()
          scrollY.reset()
          filter.reset()
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

<svelte:window bind:scrollY={$scrollY} />

<Header />
<Definitions />

<style>
  :root {
    cursor: default;
    user-select: none;
  }

  :global(body) {
    padding: 0;
  }
</style>
