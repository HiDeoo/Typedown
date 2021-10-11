<script lang="ts">
  import { definitions } from '../stores/definitions'
  import { filter, isFiltering, results } from '../stores/filters'
  import Section from './Section.svelte'
  import Definition from './Definition.svelte'
  import Loader from './Loader.svelte'
  import Nis from './NonIdealState.svelte'
  import Button from './Button.svelte'

  $: isLoading = $definitions.allIds.length === 0
  $: entries = $isFiltering ? $results : $definitions.allIds

  function onClickResetFilter() {
    filter.reset()
  }
</script>

<Section>
  {#if isLoading}
    <Loader />
  {:else if entries.length > 0}
    {#each entries as identifier}
      <Definition {identifier} />
    {/each}
  {:else}
    <Nis text="No definitions matching “<em>{$filter}</em>“!" icon="report">
      <Button on:click={onClickResetFilter}>Clear filter</Button>
    </Nis>
  {/if}
</Section>
