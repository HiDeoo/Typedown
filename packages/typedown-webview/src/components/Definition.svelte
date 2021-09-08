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

<strong>{identifier}</strong>
<Checkbox checked={definition.selected === true} on:change={onSelectDefinition}
  >{JSON.stringify(definition)} - {JSON.stringify(definition)} - {JSON.stringify(definition)}</Checkbox
>
<hr />

<style>
  strong {
    font-size: 1.1em;
  }
</style>
