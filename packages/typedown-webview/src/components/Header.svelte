<script lang="ts">
  import type { WebviewMessageExport } from 'typedown-shared'

  import Section from './Section.svelte'
  import Button from './Button.svelte'
  import { definitions } from '../stores/definition'

  function onClickExport() {
    vscode.postMessage<WebviewMessageExport>({ type: 'export', definitions: definitions.export() })
  }
</script>

<Section sticky class="header">
  <div>
    <Button on:click={onClickExport}>Export</Button>
  </div>
</Section>

<style>
  :global(.header) {
    box-shadow: 0 1px 4px 0 rgb(0 0 0 / 45%);
  }

  div {
    display: flex;
    justify-content: flex-end;
  }
</style>
