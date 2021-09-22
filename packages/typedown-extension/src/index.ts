import { commands, env, ExtensionContext, ProgressLocation, StatusBarAlignment, Uri, window } from 'vscode'
import { Definitions, isMessage, VSCodeMessageImport } from 'typedown-shared'

import { getDefinitions, getFolderTSConfig } from './typescript'
import { getActiveTextEditorDiskURI, getWorkspaceSingleFolder, pickWorkspaceFolder, TypedownError } from './vscode'
import { createWebviewPanel } from './webview'
import { getDefinitionsMarkdown } from './markdown'

export const COMMANDS = {
  fileToMd: 'typedown.fileToMd',
  folderToMd: 'typedown.folderToMd',
} as const

export function activate(context: ExtensionContext): void {
  context.subscriptions.push(commands.registerCommand(COMMANDS.fileToMd, () => tsToMd(context, Mode.File)))
  context.subscriptions.push(commands.registerCommand(COMMANDS.folderToMd, () => tsToMd(context, Mode.Folder)))
}

async function tsToMd(context: ExtensionContext, mode: Mode) {
  const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left)
  statusBarItem.name = 'Typedown Indicator'
  statusBarItem.text = '$(sync~spin) Generating definitions'
  statusBarItem.show()

  try {
    const tsConfig = await getWorkspaceTSConfig()
    const entryPoint = await (mode === Mode.File ? getActiveTextEditorDiskURI : pickWorkspaceFolder)()

    if (!entryPoint) {
      return
    }

    const definitions = getDefinitions(tsConfig, entryPoint)

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
          panel.dispose()
          exportDefinitions(event.definitions)
          break
        }
        case 'error': {
          window.showErrorMessage(event.message, { modal: true })
          break
        }
        default: {
          const errorStr = `Unknown message type '${event.type}' received from the webview.`

          console.error(errorStr)
          window.showErrorMessage(errorStr, { modal: true })
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

async function getWorkspaceTSConfig(): Promise<Uri> {
  const folder = getWorkspaceSingleFolder()
  const tsConfig = await getFolderTSConfig(folder.uri)

  return tsConfig
}

async function exportDefinitions(definitions: Definitions) {
  await window.withProgress(
    { location: ProgressLocation.Notification, title: 'Exporting definitions to Markdown' },
    async () => {
      const markdown = getDefinitionsMarkdown(definitions)

      return env.clipboard.writeText(markdown)
    }
  )

  return window.showInformationMessage('Markdown definitions copied to your clipboard.')
}

enum Mode {
  File,
  Folder,
}
