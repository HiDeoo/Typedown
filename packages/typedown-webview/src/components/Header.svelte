<script lang="ts">
  import type { WebviewMessageExport } from 'typedown-shared'

  import Section from './Section.svelte'
  import Button from './Button.svelte'
  import { definitions } from '../stores/definitions'

  $: exportedCount = $definitions.allIds.filter((id) => $definitions.byId[id]?._exported).length

  function onClickExport() {
    vscode.postMessage<WebviewMessageExport>({ type: 'export', definitions: definitions.getExportedDefinitions() })
  }
</script>

<Section sticky class="header">
  <div>
    <p>{exportedCount} definition{exportedCount !== 1 ? 's' : ''} selected</p>
    <div>
      <Button on:click={onClickExport} disabled={exportedCount === 0}>Export</Button>
    </div>
  </div>
</Section>

<style>
  :global(.header) {
    box-shadow: 0 1px 4px 0 rgb(0 0 0 / 45%);
  }

  div {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  p {
    margin: 0;
  }
</style>
