<script lang="ts">
  import { definitions } from '../stores/definition'
  import Section from './Section.svelte'
  import Definition from './Definition.svelte'
</script>

<Section>
  {#if $definitions?.definitions}
    {#each Object.entries($definitions.definitions) as [identifier, definition] (identifier)}
      <Definition {identifier} {definition} />
    {/each}
    {#each Object.entries($definitions.definitions) as [identifier, definition] (identifier)}
      <Definition {identifier} {definition} />
    {/each}
    {#each Object.entries($definitions.definitions) as [identifier, definition] (identifier)}
      <Definition {identifier} {definition} />
    {/each}
    {#each Object.entries($definitions.definitions) as [identifier, definition] (identifier)}
      <Definition {identifier} {definition} />
    {/each}
    {#each Object.entries($definitions.definitions) as [identifier, definition] (identifier)}
      <Definition {identifier} {definition} />
    {/each}
    {#each Object.entries($definitions.definitions) as [identifier, definition] (identifier)}
      <Definition {identifier} {definition} />
    {/each}
    {#each Object.entries($definitions.definitions) as [identifier, definition] (identifier)}
      <Definition {identifier} {definition} />
    {/each}
    {#each Object.entries($definitions.definitions) as [identifier, definition] (identifier)}
      <Definition {identifier} {definition} />
    {/each}
    {#each Object.entries($definitions.definitions) as [identifier, definition] (identifier)}
      <Definition {identifier} {definition} />
    {/each}
  {/if}
</Section>
