<script lang="ts">
  export let disabled = false
  export let primary = false
</script>

<button on:click class:primary {disabled}><slot /></button>

<style>
  button {
    background-color: var(--vscode-button-secondaryBackground);
    border: 1px solid var(--vscode-button-border);
    border-radius: 0;
    color: var(--vscode-button-secondaryForeground);
    cursor: pointer;
    line-height: 1.4em;
    padding: 4px 14px;
  }

  button:hover:enabled {
    background-color: var(--vscode-button-secondaryHoverBackground);
  }

  button:focus-visible {
    outline-color: var(--vscode-focusBorder);
    outline-width: 1px;
    outline-style: solid;
    outline-offset: 2px;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  button.primary {
    background-color: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
  }

  button.primary:hover:enabled {
    background-color: var(--vscode-button-hoverBackground);
  }
</style>
