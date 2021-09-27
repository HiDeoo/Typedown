<script lang="ts">
  import { definitions } from '../stores/definitions'
  import Section from './Section.svelte'
  import Definition from './Definition.svelte'
  import Loader from './Loader.svelte'
</script>

<Section>
  {#if $definitions.allIds.length > 0}
    {#each $definitions.allIds as identifier}
      <Definition {identifier} />
    {/each}
  {:else}
    <Loader />
  {/if}
</Section>
