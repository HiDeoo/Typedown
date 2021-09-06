import { commands, ExtensionContext, window } from 'vscode'

import { createWebviewPanel } from './webview'

export function activate(context: ExtensionContext): void {
  context.subscriptions.push(commands.registerCommand('typedown.tsToMd', () => tsToMd(context)))
}

function tsToMd(context: ExtensionContext) {
  window.showInformationMessage('Hello World from Typedown!')

  createWebviewPanel(context)
}
