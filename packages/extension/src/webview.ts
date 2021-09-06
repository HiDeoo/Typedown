import { ExtensionContext, Uri, ViewColumn, WebviewPanel, window } from 'vscode'

export function createWebviewPanel(context: ExtensionContext): void {
  const panel = window.createWebviewPanel('typedown', 'Typedown', ViewColumn.Active, { enableScripts: true })

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

  panel.webview.postMessage({ message: 'Hello from extension ' })

  panel.webview.onDidReceiveMessage((event) => {
    console.log('event ', event)
  })
}

function getWebviewPanelAssetURI(panel: WebviewPanel, name: string, context: ExtensionContext): Uri {
  return panel.webview.asWebviewUri(Uri.joinPath(context.extensionUri, 'dist/webview/assets', name))
}
