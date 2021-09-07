import { commands, ExtensionContext, StatusBarAlignment, window } from 'vscode'
import { isMessage, Schema, VSCodeMessageDefinitions } from 'typedown-shared'

import { getFolderTSConfig, getSchema } from './typescript'
import { getActiveTextEditorDiskURI, getWorkspaceSingleFolder, MaybeURI, VSCodeError } from './vscode'
import { createWebviewPanel } from './webview'

export function activate(context: ExtensionContext): void {
  context.subscriptions.push(commands.registerCommand('typedown.tsToMd', () => tsToMd(context)))
}

async function tsToMd(context: ExtensionContext) {
  const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left)
  statusBarItem.name = 'Typedown Indicator'
  statusBarItem.text = '$(sync~spin) Generating definitions'
  statusBarItem.show()

  try {
    const [tsConfig, currentFile] = await getTSConfigAndCurrentFile()
    const schema = getSchema(tsConfig, currentFile)

    showWebviewWithSchema(context, schema)
  } catch (error) {
    console.error(error)

    // Refactor when control flow analysis of aliased conditions works with `useUnknownInCatchVariables`
    // @see https://github.com/microsoft/TypeScript/issues/44880
    const message = error instanceof VSCodeError ? error.message : 'Something went wrong!'
    const detail = error instanceof VSCodeError ? error.detail : error instanceof Error ? error.message : undefined

    window.showErrorMessage(message, { detail, modal: true })
  } finally {
    statusBarItem.dispose()
  }
}

function showWebviewWithSchema(context: ExtensionContext, schema: Schema) {
  const message: VSCodeMessageDefinitions = { type: 'definitions', schema }

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

async function getTSConfigAndCurrentFile(): Promise<[tsConfig: MaybeURI, currentFile: MaybeURI]> {
  const folder = getWorkspaceSingleFolder()
  const tsConfig = await getFolderTSConfig(folder.uri)
  let currentFile: MaybeURI

  if (!tsConfig) {
    try {
      currentFile = await getActiveTextEditorDiskURI()
    } catch (error) {
      throw new VSCodeError(
        'Could not find either a TSConfig file in your workspace or an active text editor for a file on disk.'
      )
    }
  }

  return [tsConfig, currentFile]
}
