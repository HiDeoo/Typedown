<script lang="ts">
  export let checked: boolean
  export let label: string
</script>

<label>
  <input type="checkbox" {checked} on:change aria-checked={checked} aria-required={false} aria-label={label} />
  <div><slot /></div>
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
    clip: rect(1px, 1px, 1px, 1px);
    height: 1px;
    overflow: hidden;
    position: absolute;
    width: 1px;
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

  input:focus-visible ~ .checkmark {
    box-shadow: 0 0 0 1px var(--vscode-focusBorder);
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
