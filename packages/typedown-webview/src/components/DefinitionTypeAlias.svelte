<script lang="ts">
  import type { TypeAliasDefinition } from 'typedown-shared'

  export let definition: TypeAliasDefinition
</script>

<tbody>
  <tr>
    <td>{definition.description}</td>
    <td>{definition.type}</td>
  </tr>
</tbody>
