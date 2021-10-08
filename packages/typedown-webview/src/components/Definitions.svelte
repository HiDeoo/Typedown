<script lang="ts">
  import { definitions } from '../stores/definitions'
  import { isFiltering, results } from '../stores/filters'
  import Section from './Section.svelte'
  import Definition from './Definition.svelte'
  import Loader from './Loader.svelte'

  $: isLoading = $definitions.allIds.length === 0
  $: entries = $isFiltering ? $results : $definitions.allIds
</script>

<Section>
  {#if isLoading}
    <Loader />
  {:else}
    {#each entries as identifier}
      <Definition {identifier} />
    {/each}
  {/if}
</Section>
