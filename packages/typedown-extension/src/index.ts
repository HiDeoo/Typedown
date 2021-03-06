import {
  commands,
  env,
  ExtensionContext,
  ProgressLocation,
  StatusBarAlignment,
  Uri,
  WebviewPanel,
  window,
  workspace,
} from 'vscode'
import { Definitions, isMessage } from 'typedown-shared'

import { getDefinitions, getFolderTSConfig } from './typescript'
import { getActiveTextEditorDiskURI, getWorkspaceSingleFolder, pickWorkspaceFolder, TypedownError } from './vscode'
import { createWebviewPanel } from './webview'
import { getDefinitionsMarkdown } from './markdown'

export const COMMANDS = {
  fileToMd: 'typedown.fileToMd',
  folderToMd: 'typedown.folderToMd',
  openExampleProject: 'typedown.openExampleProject',
  openFileExample: 'typedown.openFileExample',
} as const

export function activate(context: ExtensionContext): void {
  context.subscriptions.push(commands.registerCommand(COMMANDS.fileToMd, () => tsToMd(context, Mode.File)))
  context.subscriptions.push(commands.registerCommand(COMMANDS.folderToMd, () => tsToMd(context, Mode.Folder)))
  context.subscriptions.push(commands.registerCommand(COMMANDS.openExampleProject, () => openExampleProject(context)))
  context.subscriptions.push(commands.registerCommand(COMMANDS.openFileExample, () => openFileExample(context)))
}

async function tsToMd(context: ExtensionContext, mode: Mode) {
  const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left)
  statusBarItem.name = 'Typedown Indicator'
  statusBarItem.text = '$(sync~spin) Generating definitions'
  statusBarItem.show()

  let webviewPanel: WebviewPanel | undefined

  try {
    const tsConfig = await getWorkspaceTSConfig()
    const entryPoint = await (mode === Mode.File ? getActiveTextEditorDiskURI : pickWorkspaceFolder)()

    if (!entryPoint) {
      return
    }

    webviewPanel = await showWebview(context)

    const definitions = getDefinitions(tsConfig, entryPoint)

    webviewPanel.webview.postMessage({ type: 'import', definitions })
  } catch (error) {
    console.error(error)

    if (webviewPanel) {
      webviewPanel.dispose()
    }

    // Refactor when control flow analysis of aliased conditions works with `useUnknownInCatchVariables`
    // @see https://github.com/microsoft/TypeScript/issues/44880
    const message = error instanceof TypedownError ? error.message : 'Something went wrong!'
    const detail = error instanceof TypedownError ? error.detail : error instanceof Error ? error.message : undefined
    const outputChannelOnlyDetail =
      error instanceof TypedownError && error.outputChannelOnlyDetail ? error.outputChannelOnlyDetail : undefined

    const output = window.createOutputChannel('Typedown')
    output.appendLine(message)

    if (detail) {
      output.appendLine(`${detail}\n`)
    }

    if (outputChannelOnlyDetail) {
      output.appendLine(outputChannelOnlyDetail)
    }

    const errorActions: string[] = []

    if (outputChannelOnlyDetail) {
      errorActions.push(ErrorAction.ShowDetails)
    }

    const action = await window.showErrorMessage(message, { detail, modal: true }, ...errorActions)

    if (action === ErrorAction.ShowDetails) {
      output.show(false)
    }
  } finally {
    statusBarItem.dispose()
  }
}

function openExampleProject(context: ExtensionContext) {
  return commands.executeCommand('vscode.openFolder', Uri.joinPath(context.extensionUri, 'examples'), {
    forceNewWindow: false,
    noRecentEntry: true,
  })
}

async function openFileExample(context: ExtensionContext) {
  const document = await workspace.openTextDocument(Uri.joinPath(context.extensionUri, 'examples/src/index.ts'))

  return window.showTextDocument(document)
}

function showWebview(context: ExtensionContext): Promise<WebviewPanel> {
  return new Promise((resolve) => {
    const [panel, restored] = createWebviewPanel(context, (event) => {
      if (isMessage(event)) {
        switch (event.type) {
          case 'init': {
            resolve(panel)
            break
          }
          case 'export': {
            panel.dispose()
            exportDefinitions(event.definitions, event.headingLevel)
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

    panel.reveal()

    if (restored) {
      resolve(panel)
    }
  })
}

async function getWorkspaceTSConfig(): Promise<Uri> {
  const folder = getWorkspaceSingleFolder()
  const tsConfig = await getFolderTSConfig(folder.uri)

  return tsConfig
}

export async function exportDefinitions(definitions: Definitions, headingLevel: number): Promise<string | undefined> {
  await window.withProgress(
    { location: ProgressLocation.Notification, title: 'Exporting definitions to Markdown' },
    async () => {
      const markdown = getDefinitionsMarkdown(definitions, headingLevel)

      return env.clipboard.writeText(markdown)
    }
  )

  return window.showInformationMessage('Markdown definitions copied to your clipboard.')
}

enum Mode {
  File,
  Folder,
}

enum ErrorAction {
  ShowDetails = 'Show Details',
}
