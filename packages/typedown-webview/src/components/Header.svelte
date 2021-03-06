<script lang="ts">
  import type { WebviewMessageExport } from 'typedown-shared'

  import Section from './Section.svelte'
  import Button from './Button.svelte'
  import Input from './Input.svelte'
  import HeadingLevelPicker from './HeadingLevelPicker.svelte'
  import { definitions } from '../stores/definitions'
  import { filter } from '../stores/filters'
  import vscode from '../lib/vscode'

  $: showDetails = $definitions.allIds.length > 0
  $: exportedCount = $definitions.allIds.filter((id) => $definitions.byId[id]?.exported).length
  $: hasNoExported = exportedCount === 0
  $: selectAllLabel = hasNoExported ? 'Select All' : 'Clear All'

  function onClickSelectAll() {
    definitions.selectAll(hasNoExported)
  }

  function onClickExport() {
    vscode.postMessage<WebviewMessageExport>({
      type: 'export',
      definitions: definitions.getExportedDefinitions(),
      headingLevel: $definitions.headingLevel,
    })
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
      <HeadingLevelPicker disabled={!showDetails} />
      <Input bind:value={$filter} on:reset={onResetFilter} disabled={!showDetails} placeholder="Filter" />
      <Button primary on:click={onClickExport} disabled={!showDetails || hasNoExported}>Export</Button>
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
    gap: 6px;
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
