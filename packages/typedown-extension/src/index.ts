import { commands, ExtensionContext, StatusBarAlignment, Uri, window } from 'vscode'
import { Definitions, isMessage, VSCodeMessageImport } from 'typedown-shared'

import { getDefinitions, getFolderTSConfig } from './typescript'
import { getActiveTextEditorDiskURI, getWorkspaceSingleFolder, MaybeURI, TypedownError } from './vscode'
import { createWebviewPanel } from './webview'

export function activate(context: ExtensionContext): void {
  context.subscriptions.push(commands.registerCommand('typedown.fileToMd', () => fileToMd(context)))
}

async function fileToMd(context: ExtensionContext) {
  const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left)
  statusBarItem.name = 'Typedown Indicator'
  statusBarItem.text = '$(sync~spin) Generating definitions'
  statusBarItem.show()

  try {
    const [tsConfig, currentFile] = await getTSConfigAndCurrentFile()
    const definitions = getDefinitions(tsConfig, currentFile)

    showWebviewWithDefinitions(context, definitions)
  } catch (error) {
    console.error(error)

    // Refactor when control flow analysis of aliased conditions works with `useUnknownInCatchVariables`
    // @see https://github.com/microsoft/TypeScript/issues/44880
    const message = error instanceof TypedownError ? error.message : 'Something went wrong!'
    const detail = error instanceof TypedownError ? error.detail : error instanceof Error ? error.message : undefined

    window.showErrorMessage(message, { detail, modal: true })
  } finally {
    statusBarItem.dispose()
  }
}

function showWebviewWithDefinitions(context: ExtensionContext, definitions: Definitions) {
  const message: VSCodeMessageImport = { type: 'import', definitions }

  const panel = createWebviewPanel(context, (event) => {
    if (isMessage(event)) {
      switch (event.type) {
        case 'init': {
          panel.webview.postMessage(message)
          break
        }
        case 'export': {
          console.log('event ', event.definitions)
          break
        }
        default: {
          console.error('Unknown message type received from the webview.')
          break
        }
      }
    }
  })

  if (!panel.visible) {
    panel.webview.postMessage(message)
    panel.reveal()
  }
}

async function getTSConfigAndCurrentFile(): Promise<[tsConfig: MaybeURI, currentFile: Uri]> {
  const folder = getWorkspaceSingleFolder()
  const tsConfig = await getFolderTSConfig(folder.uri)
  const currentFile = await getActiveTextEditorDiskURI()

  return [tsConfig, currentFile]
}
