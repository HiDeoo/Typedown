<script lang="ts" context="module">
  export interface Item {
    label: string
    value: string
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import Select from 'svelte-select'

  export let items: Item[]
  export let value: Item
  export let disabled = false

  const dispatch = createEventDispatcher<{ select: Item }>()

  function onInternalSelect(event: CustomEvent<Item>) {
    dispatch('select', event.detail)
  }
</script>

<div class="wrapper">
  <Select
    {items}
    {value}
    on:select={onInternalSelect}
    isDisabled={disabled}
    listAutoWidth={false}
    isSearchable={false}
    isClearable={false}
    listOffset={0}
    showIndicator
    indicatorSvg={'<i class="codicon codicon-chevron-down" />'}
  />
</div>

<style>
  .wrapper {
    --background: var(--vscode-dropdown-background);
    --border: 1px solid var(--vscode-dropdown-border);
    --borderFocusColor: var(--vscode-focusBorder);
    --borderHoverColor: var(--vscode-dropdown-border);
    --borderRadius: 0;
    --disabledBackground: var(--vscode-dropdown-background);
    --disabledBorderColor: var(--vscode-dropdown-border);
    --disabledColor: var(--vscode-dropdown-foreground);
    --height: 26px;
    --indicatorColor: var(--vscode-dropdown-foreground);
    --indicatorRight: 3px;
    --indicatorTop: 5px;
    --itemColor: var(--vscode-dropdown-foreground);
    --itemFirstBorderRadius: 0;
    --itemHoverBG: var(--vscode-dropdown-background);
    --itemHoverColor: var(--vscode-dropdown-foreground);
    --itemIsActiveBG: var(--vscode-dropdown-listBackground);
    --itemIsActiveColor: var(--vscode-dropdown-foreground);
    --itemPadding: 0 6px;
    --listBackground: var(--vscode-dropdown-listBackground);
    --listBorder: 1px solid var(--vscode-focusBorder);
    --listBorderRadius: 0;
    --listLeft: -1px;
    --padding: 0 10px;
  }

  .wrapper :global(.item) {
    border: 1px solid transparent;
    cursor: pointer;
    margin: 1px;
  }

  .wrapper :global(.item.hover) {
    border: 1px solid var(--vscode-focusBorder);
  }

  :global(.selectContainer.disabled) {
    cursor: not-allowed;
    opacity: 0.4;
  }

  .wrapper :global(input:disabled) {
    cursor: not-allowed;
  }
</style>
