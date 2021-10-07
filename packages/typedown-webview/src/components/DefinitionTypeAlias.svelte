<script lang="ts">
  import type { TypeAliasDefinition } from 'typedown-shared'

  import Code from './Code.svelte'

  export let definition: TypeAliasDefinition
</script>

<tbody>
  <tr>
    <td>{definition.description}</td>
    <td><Code>{definition.type}</Code></td>
  </tr>
</tbody>
