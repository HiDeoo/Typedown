<script lang="ts">
  import { definitions } from '../stores/definitions'
  import Section from './Section.svelte'
  import Definition from './Definition.svelte'
</script>

{#if $definitions.allIds.length > 0}
  <Section>
    {#each $definitions.allIds as identifier}
      <Definition {identifier} />
    {/each}
  </Section>
{/if}
