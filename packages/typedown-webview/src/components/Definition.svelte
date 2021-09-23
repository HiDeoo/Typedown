<script lang="ts">
  import type { DefinitionIdentifier } from 'typedown-shared'

  import { definitions } from '../stores/definitions'
  import Checkbox from './Checkbox.svelte'

  export let identifier: DefinitionIdentifier

  $: definition = $definitions.byId[identifier]
  $: exported = definition?.exported === true

  function onChangeExported() {
    definitions.toggle(identifier)
  }
</script>

{#if definition}
  <div class="definition">
    <div class="definitionMask" />
    {#if exported}
      <div class="definitionIndicator" />
    {/if}
    <strong>{definition.name}</strong>
    <Checkbox checked={exported} on:change={onChangeExported}>{JSON.stringify(definition)}</Checkbox>
  </div>
{/if}

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
