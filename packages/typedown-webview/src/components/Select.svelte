<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import Select from 'svelte-select'

  type Option = $$Generic

  export let options: Option[]
  export let value: Option
  export let disabled = false
  export let optionRenderer: (option: Option) => string

  const dispatch = createEventDispatcher<{ select: Option }>()

  function onInternalSelect(event: CustomEvent<InternalOption | number>) {
    if (isInternalOption(event.detail)) {
      dispatch('select', event.detail.value)
    }
  }

  function onInternalOptionRenderer(option: InternalOption) {
    return optionRenderer(option.value)
  }

  function onInternalSRenderer(option: Option | InternalOption) {
    return optionRenderer(isInternalOption(option) ? option.value : option)
  }

  function isInternalOption(option: Option | InternalOption | number): option is InternalOption {
    return typeof option === 'object' && typeof (option as InternalOption).value !== 'undefined'
  }

  interface InternalOption {
    index: number
    label: string
    value: Option
  }
</script>

<div class="select">
  <Select
    items={options}
    {value}
    on:select={onInternalSelect}
    getOptionLabel={onInternalOptionRenderer}
    getSelectionLabel={onInternalSRenderer}
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
  .select {
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
    --listBackground: var(--vscode-dropdown-listBackground, var(--vscode-dropdown-background));
    --listBorder: 1px solid var(--vscode-focusBorder);
    --listBorderRadius: 0;
    --listLeft: -1px;
    --padding: 0 10px;
  }

  .select :global(.item) {
    border: 1px solid transparent;
    cursor: pointer;
    margin: 1px;
  }

  .select :global(.item.hover) {
    border: 1px solid var(--vscode-focusBorder);
  }

  :global(.selectContainer.disabled) {
    cursor: not-allowed;
    opacity: 0.4;
  }

  .select :global(input:disabled) {
    cursor: not-allowed;
  }
</style>
