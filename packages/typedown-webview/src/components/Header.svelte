<script lang="ts">
  import type { WebviewMessageExport } from 'typedown-shared'

  import Section from './Section.svelte'
  import { definitions } from '../stores/definition'

  function onClickExport() {
    vscode.postMessage<WebviewMessageExport>({ type: 'export', definitions: definitions.export() })
  }
</script>

<Section sticky>
  <button on:click={onClickExport}>Export</button>
</Section>
