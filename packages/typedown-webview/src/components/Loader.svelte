<div>
  <p class="icon"><i class="codicon codicon-sync" /></p>
  <p class="text">Generating definitions…</p>
</div>

<style>
  div {
    color: var(--vscode-tab-inactiveForeground);
    overflow: hidden;
  }

  .icon {
    display: block;
  }

  .icon .codicon {
    animation: rotate 1.6s linear infinite;
    font-size: 60px;
  }

  .text {
    display: flex;
    font-weight: 500;
    font-size: 20px;
    justify-content: center;
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
