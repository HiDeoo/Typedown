<script lang="ts">
  import type { DefinitionChild } from 'typedown-shared'

  import Code from './Code.svelte'

  export let children: DefinitionChild[]
</script>

<tbody>
  {#each children as child (child[0])}
    <tr>
      <td>{child[0]}</td>
      <td>{child[1]}</td>
      <td><Code>{child[2]}</Code></td>
      <td>
        {#if child[3]}
          <i class="codicon codicon-check" />
        {/if}
      </td>
      <td>{child[4]}</td>
    </tr>
  {/each}
</tbody>
