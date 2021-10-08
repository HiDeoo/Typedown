<table>
  <slot />
</table>

<style>
  table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
  }

  table,
  table :global(th),
  table :global(td) {
    border: 1px solid var(--vscode-panel-border);
  }

  table :global(th),
  table :global(td) {
    height: 25px;
    padding: 4px 6px;
    overflow-wrap: break-word;
  }

  table :global(th) {
    background-color: var(--vscode-tab-inactiveBackground);
    font-weight: 600;
  }

  table :global(td) {
    background-color: var(--vscode-list-hoverBackground);
    position: relative;
    vertical-align: top;
  }
</style>
