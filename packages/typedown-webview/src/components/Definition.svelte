<script lang="ts">
  import {
    DefinitionIdentifier,
    isInterfaceDefinition,
    isObjectTypeAliasDefinition,
    isTypeAliasDefinition,
  } from 'typedown-shared'

  import { definitions } from '../stores/definitions'
  import Checkbox from './Checkbox.svelte'
  import Table from './Table.svelte'
  import DefinitionChildren from './DefinitionChildren.svelte'
  import DefinitionHeader from './DefinitionHeader.svelte'
  import DefinitionTypeAlias from './DefinitionTypeAlias.svelte'

  export let identifier: DefinitionIdentifier

  $: definition = $definitions.byId[identifier]
  $: exported = definition?.exported === true
  $: hasDescription =
    definition &&
    (isInterfaceDefinition(definition) || isObjectTypeAliasDefinition(definition)) &&
    definition.description.length > 0

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
    {#if hasDescription}
      <div class="description">{definition.description}</div>
    {/if}
    <Checkbox checked={exported} on:change={onChangeExported}>
      <Table>
        <DefinitionHeader {definition} />
        {#if isInterfaceDefinition(definition) || isObjectTypeAliasDefinition(definition)}
          <DefinitionChildren children={definition.children} />
        {:else if isTypeAliasDefinition(definition)}
          <DefinitionTypeAlias {definition} />
        {/if}
      </Table>
    </Checkbox>
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
    display: block;
    font-size: 1.1em;
    overflow: hidden;
    position: relative;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .description {
    margin-bottom: 12px;
    margin-top: 6px;
    position: relative;
  }
</style>
