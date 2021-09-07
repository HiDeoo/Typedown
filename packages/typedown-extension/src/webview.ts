import { ExtensionContext, Uri, ViewColumn, WebviewPanel, window } from 'vscode'

let panel: WebviewPanel | undefined

export function createWebviewPanel(
  context: ExtensionContext,
  onDidReceiveMessage: (event: unknown) => void
): WebviewPanel {
  if (panel) {
    return panel
  }

  panel = window.createWebviewPanel('typedown', 'Typedown', ViewColumn.Active, { enableScripts: true })

  panel.webview.onDidReceiveMessage(onDidReceiveMessage)

  panel.onDidDispose(
    () => {
      panel = undefined
    },
    null,
    context.subscriptions
  )

  const jsURI = getWebviewPanelAssetURI(panel, 'index.js', context)
  const cssURI = getWebviewPanelAssetURI(panel, 'index.css', context)

  panel.webview.html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Typedown</title>
    <script type="module" crossorigin src="${jsURI}"></script>
    <link rel="stylesheet" href="${cssURI}">
  </head>
  <body>
    <div id="app"></div>
    <script>
      const vscode = acquireVsCodeApi();
    </script>
  </body>
</html>`

  return panel
}

function getWebviewPanelAssetURI(panel: WebviewPanel, name: string, context: ExtensionContext): Uri {
  return panel.webview.asWebviewUri(Uri.joinPath(context.extensionUri, 'dist/webview/assets', name))
}
