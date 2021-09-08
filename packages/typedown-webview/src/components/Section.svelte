<script lang="ts">
  export let sticky = false
</script>

<section class:sticky>
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
