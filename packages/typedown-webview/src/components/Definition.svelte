<script lang="ts">
  import type { Definition } from 'typedown-shared'

  import { definitions } from '../stores/definition'
  import Checkbox from './Checkbox.svelte'

  export let identifier: string
  export let definition: Definition

  function onSelectDefinition() {
    definitions.toggle(identifier)
  }
</script>

<div class="definition">
  <div class="definitionMask" />
  <strong>{identifier}</strong>
  <Checkbox checked={definition.selected === true} on:change={onSelectDefinition}
    >{JSON.stringify(definition)} - {JSON.stringify(definition)} - {JSON.stringify(definition)}</Checkbox
  >
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

  strong {
    font-size: 1.1em;
    position: relative;
  }
</style>
