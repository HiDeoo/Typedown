<script lang="ts">
  import type { WebviewMessageExport } from 'typedown-shared'

  import Section from './Section.svelte'
  import Button from './Button.svelte'
  import Input from './Input.svelte'
  import { definitions } from '../stores/definitions'
  import { filter } from '../stores/filters'

  $: showDetails = $definitions.allIds.length > 0
  $: exportedCount = $definitions.allIds.filter((id) => $definitions.byId[id]?.exported).length
  $: hasExported = exportedCount === 0
  $: selectAllLabel = hasExported ? 'Select All' : 'Clear All'

  function onClickSelectAll() {
    definitions.selectAll(hasExported)
  }

  function onClickExport() {
    vscode.postMessage<WebviewMessageExport>({ type: 'export', definitions: definitions.getExportedDefinitions() })
  }

  function onResetFilter() {
    filter.reset()
  }
</script>

<Section sticky class="header">
  <header>
    <div class="details">
      {#if showDetails}
        <span>{exportedCount} definition{exportedCount !== 1 ? 's' : ''} selected (</span>
        <button type="button" on:click={onClickSelectAll}>{selectAllLabel}</button>
        <span>)</span>
      {/if}
    </div>
    <div class="controls">
      <Input bind:value={$filter} on:reset={onResetFilter} disabled={!showDetails} placeholder="Filter" />
      <Button primary on:click={onClickExport} disabled={hasExported}>Export</Button>
    </div>
  </header>
</Section>

<style>
  :global(.header) {
    box-shadow: 0 1px 4px 0 var(--vscode-widget-shadow);
  }

  header {
    align-items: stretch;
    display: flex;
    justify-content: space-between;
  }

  .details {
    align-items: center;
    color: var(--vscode-tab-inactiveForeground);
    display: flex;
    margin-right: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .controls {
    display: flex;
  }

  button {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    font: inherit;
    outline: inherit;
    padding: 0;
    text-decoration: underline;
  }

  button:hover {
    text-decoration: none;
  }

  button:focus-visible {
    outline: 1px solid var(--vscode-focusBorder);
    outline-offset: 4px;
  }
</style>
