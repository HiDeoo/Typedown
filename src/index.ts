import { commands, ExtensionContext, Uri, ViewColumn, window } from 'vscode'

export function activate(context: ExtensionContext): void {
  context.subscriptions.push(commands.registerCommand('typedown.tsToMd', () => tsToMd(context)))
}

function tsToMd(context: ExtensionContext) {
  window.showInformationMessage('Hello World from Typedown!')

  const panel = window.createWebviewPanel('typedown', 'Typedown', ViewColumn.Active, { enableScripts: true })

  const jsURI = panel.webview.asWebviewUri(Uri.joinPath(context.extensionUri, 'dist/webview/assets', 'index.js'))
  const cssURI = panel.webview.asWebviewUri(Uri.joinPath(context.extensionUri, 'dist/webview/assets', 'index.css'))

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
  </body>
</html>`
}
