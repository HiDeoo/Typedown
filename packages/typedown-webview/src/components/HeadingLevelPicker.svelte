<script lang="ts">
  import { definitions } from '../stores/definitions'
  import Select from './Select.svelte'

  export let disabled = false

  const levels = [1, 2, 3, 4, 5, 6]

  function onSelect(event: CustomEvent<number>) {
    definitions.setHeadingLevel(event.detail)
  }

  function renderHeadingOption(item: number): string {
    return `Heading ${item}`
  }
</script>

<Select
  {disabled}
  options={levels}
  value={$definitions.headingLevel}
  on:select={onSelect}
  optionRenderer={renderHeadingOption}
/>

<style>
  :global(.select) {
    width: 110px;
  }
</style>
