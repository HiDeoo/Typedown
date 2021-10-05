<script lang="ts">
  import type { DefinitionChild } from 'typedown-shared'

  export let children: DefinitionChild[]
</script>

<tbody>
  {#each children as child (child[0])}
    <tr>
      <td>{child[0]}</td>
      <td>{child[1]}</td>
      <td>{child[2]}</td>
      <td>{child[3] ? '✓' : ''}</td>
      <td>{child[4]}</td>
    </tr>
  {/each}
</tbody>
