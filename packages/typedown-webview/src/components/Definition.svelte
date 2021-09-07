<script lang="ts">
  import { definitions, Definition } from '../stores/definition'

  export let identifier: string
  export let definition: Definition

  function onClick() {
    definitions.toggle(identifier)
  }
</script>

<h1>{identifier}</h1>
<div>{JSON.stringify(definition)}</div>
<div><button on:click={onClick}>Toggle</button></div>
<hr />
