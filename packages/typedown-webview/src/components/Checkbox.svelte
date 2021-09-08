<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let checked: boolean

  const dispatch = createEventDispatcher<{ change: boolean }>()

  function onChange() {
    checked = !checked
    dispatch('change', checked)
  }
</script>

<label>
  <div><slot /></div>
  <input type="checkbox" on:change={onChange} {checked} />
  <span class="checkmark" />
</label>

<style>
  label {
    cursor: pointer;
    display: block;
    margin-top: 6px;
    padding-left: 27px;
    position: relative;
    user-select: none;
  }

  input {
    display: none;
  }

  .checkmark {
    background-color: var(--vscode-checkbox-background);
    border: 1px solid var(--vscode-checkbox-border);
    border-radius: 3px;
    height: 18px;
    left: 0;
    opacity: 0.8;
    position: absolute;
    top: 0;
    width: 18px;
  }

  .checkmark:hover {
    opacity: 1;
  }

  label input:checked ~ .checkmark {
    opacity: 1;
  }

  .checkmark:after {
    display: none;
    content: '';
    position: absolute;
  }

  label input:checked ~ .checkmark:after {
    display: block;
  }

  label .checkmark:after {
    left: 5px;
    top: 0;
    width: 6px;
    height: 12px;
    border: solid white;
    border-width: 0 1px 1px 0;
    transform: rotate(50deg) skew(15deg);
  }
</style>
