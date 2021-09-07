<script lang="ts">
  import { definitions } from '../stores/definition'
  import Definition from './Definition.svelte'
</script>

{#if $definitions?.schema?.definitions}
  {#each Object.entries($definitions.schema.definitions) as [name, definition] (name)}
    <Definition {name} {definition} />
  {/each}
{/if}
