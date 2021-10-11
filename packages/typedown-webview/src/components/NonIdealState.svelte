<script lang="ts">
  export let text: string
  export let icon: string | undefined = undefined
  export let iconRotate = false
</script>

<div>
  {#if icon}
    <p class="icon" class:rotate={iconRotate}><i class="codicon codicon-{icon}" /></p>
  {/if}
  <p class="text">{@html text}</p>
  <div><slot /></div>
</div>

<style>
  div {
    align-items: center;
    color: var(--vscode-tab-inactiveForeground);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .icon {
    display: block;
    margin-bottom: 0;
  }

  .icon .codicon {
    font-size: 60px;
  }

  .icon.rotate .codicon {
    animation: rotate 1.6s linear infinite;
  }

  .text {
    font-weight: 500;
    font-size: 20px;
  }

  @keyframes rotate {
    from {
      transform: rotate(0);
    }

    to {
      transform: rotate(360deg);
    }
  }
</style>
