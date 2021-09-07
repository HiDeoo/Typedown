import { commands, ExtensionContext, window } from 'vscode'
import { isWebviewMessageExport, isWebviewMessageReady, VSCodeMessageDefinitions } from 'typedown-messages'

import { getFolderTSConfig, getSchema, TSSchema } from './typescript'
import { getActiveTextEditorDiskURI, getWorkspaceSingleFolder, MaybeURI, VSCodeError } from './vscode'
import { createWebviewPanel } from './webview'

export function activate(context: ExtensionContext): void {
  context.subscriptions.push(commands.registerCommand('typedown.tsToMd', () => tsToMd(context)))
}

async function tsToMd(context: ExtensionContext) {
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
  }
}

function showWebviewWithSchema(context: ExtensionContext, schema: TSSchema) {
  const panel = createWebviewPanel(context)

  panel.webview.onDidReceiveMessage((event) => {
    if (isWebviewMessageReady(event)) {
      // TODO(HiDeoo) Could this be called multiple times if the webview is hidden/shown?

      const message: VSCodeMessageDefinitions = { type: 'definitions', schema }
      panel.webview.postMessage(message)
    } else if (isWebviewMessageExport(event)) {
      console.log('event.data ', event.definitions)
    }
  })
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
