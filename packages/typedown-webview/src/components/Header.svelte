<script lang="ts">
  import type { WebviewMessageExport } from 'typedown-shared'

  import Section from './Section.svelte'
  import Button from './Button.svelte'
  import { definitions } from '../stores/definitions'

  $: showDetails = $definitions.allIds.length > 0
  $: exportedCount = $definitions.allIds.filter((id) => $definitions.byId[id]?.exported).length

  function onClickExport() {
    vscode.postMessage<WebviewMessageExport>({ type: 'export', definitions: definitions.getExportedDefinitions() })
  }
</script>

<Section sticky class="header">
  <header>
    <div class="details">
      {#if showDetails}
        <span>{exportedCount} definition{exportedCount !== 1 ? 's' : ''} selected</span>
      {/if}
    </div>
    <div>
      <Button on:click={onClickExport} disabled={exportedCount === 0}>Export</Button>
    </div>
  </header>
</Section>

<style>
  :global(.header) {
    box-shadow: 0 1px 4px 0 rgb(0 0 0 / 45%);
  }

  header {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  .details {
    color: var(--vscode-tab-inactiveForeground);
  }
</style>
