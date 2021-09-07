<script lang="ts">
  import { definitions } from '../stores/definition'
  import Definition from './Definition.svelte'
</script>

{#if $definitions?.definitions}
  {#each Object.entries($definitions.definitions) as [identifier, definition] (identifier)}
    <Definition {identifier} {definition} />
  {/each}
{/if}
