<script lang="ts">
  import { schema } from '../stores/schema'
  import Section from './Section.svelte'
  import Definition from './Definition.svelte'
</script>

{#if $schema}
  <Section>
    {#each $schema.children as definition}
      <Definition {definition} />
    {/each}
  </Section>
{/if}
