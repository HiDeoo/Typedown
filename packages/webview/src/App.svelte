<script lang="ts">
  import { onDestroy, onMount } from 'svelte'

  onMount(() => {
    window.addEventListener('message', onMessage)
  })

  onDestroy(() => {
    window.removeEventListener('message', onMessage)
  })

  function onMessage(event: unknown) {
    console.log('event ', event)

    vscode.postMessage({ message: 'Hello from webview' })
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
