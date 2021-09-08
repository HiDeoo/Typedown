<button on:click><slot /></button>

<style>
  button {
    background-color: var(--vscode-button-background);
    border: 1px solid var(--vscode-button-border);
    border-radius: 0;
    color: var(--vscode-button-foreground);
    cursor: pointer;
    line-height: 1.4em;
    margin-right: 4px;
    margin-top: 4px;
    padding: 2px 14px;
  }

  button:hover {
    background-color: var(--vscode-button-hoverBackground);
  }

  button:focus-visible {
    outline-color: var(--vscode-focusBorder);
    outline-width: 1px;
    outline-style: solid;
    outline-offset: 2px;
  }
</style>
