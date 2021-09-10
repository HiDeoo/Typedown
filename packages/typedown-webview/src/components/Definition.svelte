<script lang="ts">
  import type { Definition } from 'typedown-shared'

  import { definitions } from '../stores/definitions'
  import Checkbox from './Checkbox.svelte'

  export let definition: Definition

  $: selected = typeof $definitions[definition.id] !== 'undefined'

  function onSelectDefinition() {
    definitions.toggle(definition)
  }
</script>

<div class="definition">
  <div class="definitionMask" />
  {#if selected}
    <div class="definitionIndicator" />
  {/if}
  <strong>{definition.name}</strong>
  <Checkbox checked={selected} on:change={onSelectDefinition}>{JSON.stringify(definition)}</Checkbox>
</div>

<style>
  .definition {
    padding: 12px 14px 26px 14px;
    position: relative;
  }

  .definitionMask {
    background-color: var(--vscode-textCodeBlock-background);
    bottom: 0;
    display: none;
    left: 0;
    opacity: 0.6;
    position: absolute;
    right: 0;
    top: 0;
  }

  .definition:hover .definitionMask {
    display: block;
  }

  .definitionIndicator {
    background-color: var(--vscode-settings-modifiedItemIndicator);
    bottom: 20px;
    left: 4px;
    position: absolute;
    top: 12px;
    width: 2px;
  }

  strong {
    font-size: 1.1em;
    position: relative;
  }
</style>
