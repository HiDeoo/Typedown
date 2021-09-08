<script lang="ts">
  let className = ''
  export { className as class }
  export let sticky = false
</script>

<section class:sticky class={className}>
  <div>
    <slot />
  </div>
</section>

<style>
  section {
    background-color: var(--vscode-editor-background);
  }

  section.sticky {
    position: sticky;
    top: 0;
  }

  div {
    margin: auto;
    max-width: 1000px;
    padding: 12px 14px;
  }
</style>
