<script lang="ts">
  import { Definition, isTypeAliasDefinition } from 'typedown-shared'

  export let definition: Definition

  $: isTypeAlias = isTypeAliasDefinition(definition)
</script>

<thead>
  <tr class:typeAlias={isTypeAlias}>
    {#if !isTypeAlias}
      <th>Name</th>
    {/if}
    <th>Description</th>
    <th>Type</th>
    {#if !isTypeAlias}
      <th>Optional</th>
      <th>Default value</th>
    {/if}
  </tr>
</thead>

<style>
  th:nth-child(1) {
    width: 20%;
  }

  th:nth-child(2) {
    width: 39%;
  }

  th:nth-child(3) {
    width: 25%;
  }

  th:nth-child(4) {
    width: 1%;
  }

  th:nth-child(5) {
    width: 15%;
  }

  tr.typeAlias th:nth-child(1) {
    width: 55%;
  }

  tr.typeAlias th:nth-child(2) {
    width: 45%;
  }
</style>
