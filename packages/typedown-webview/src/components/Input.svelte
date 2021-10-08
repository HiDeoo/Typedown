<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let value: string
  export let disabled = false
  export let placeholder = ''

  let input: HTMLInputElement

  const dispatch = createEventDispatcher()

  function onReset() {
    dispatch('reset')

    if (input) {
      input.focus()
    }
  }
</script>

<div>
  <input bind:this={input} type="text" bind:value {disabled} {placeholder} aria-label={placeholder} />
  <button on:click={onReset} disabled={value.length === 0} title="Clear filter" aria-label="Clear filter">
    <i class="codicon codicon-clear-all" />
  </button>
</div>

<style>
  div {
    position: relative;
  }

  input {
    background-color: var(--vscode-input-background);
    border: 1px solid var(--vscode-input-border);
    color: var(--vscode-input-foreground);
    line-height: 1.4em;
    margin-right: 4px;
    padding: 2px 28px 2px 4px;
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

  button {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    font: inherit;
    outline: inherit;
    padding: 0;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(calc(-50% + 1px));
  }

  button:disabled {
    opacity: 0.2;
  }

  button:focus {
    outline: 1px solid var(--vscode-focusBorder);
    outline-offset: 1px;
  }
</style>
