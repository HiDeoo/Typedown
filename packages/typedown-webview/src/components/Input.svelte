<script lang="ts">
  export let value: string
  export let disabled = false
  export let placeholder = ''
</script>

<input type="text" bind:value {disabled} {placeholder} aria-label={placeholder} />

<style>
  input {
    background-color: var(--vscode-input-background);
    border: 1px solid var(--vscode-input-border);
    color: var(--vscode-input-foreground);
    line-height: 1.4em;
    margin-right: 4px;
    padding: 2px 4px;
  }

  input::placeholder {
    color: var(--vscode-input-placeholderForeground);
  }

  input:focus {
    outline: 1px solid var(--vscode-focusBorder);
  }

  input::selection {
    background-color: var(--vscode-editor-selectionBackground);
  }

  input:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
</style>
