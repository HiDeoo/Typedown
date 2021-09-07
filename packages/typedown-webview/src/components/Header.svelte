<script lang="ts">
  import type { WebviewMessageExport } from 'typedown-shared'

  import { definitions } from '../stores/definition'

  function onClickExport() {
    vscode.postMessage<WebviewMessageExport>({ type: 'export', definitions: definitions.export() })
  }
</script>

<header>
  <button on:click={onClickExport}>Export</button>
</header>
