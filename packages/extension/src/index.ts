import { commands, ExtensionContext, Uri, window } from 'vscode'

import { getFolderTSConfig } from './typescript'
import { getActiveTextEditorDiskURI, getWorkspaceSingleFolder, VSCodeError } from './vscode'

export function activate(context: ExtensionContext): void {
  context.subscriptions.push(commands.registerCommand('typedown.tsToMd', () => tsToMd(context)))
}

async function tsToMd(_context: ExtensionContext) {
  try {
    const folder = getWorkspaceSingleFolder()
    const tsConfig = await getFolderTSConfig(folder.uri)
    let file: Uri | undefined

    if (!tsConfig) {
      try {
        file = await getActiveTextEditorDiskURI()
      } catch (error) {
        throw new VSCodeError(
          'Could not find either a TSConfig file in your workspace or an active text editor for a file on disk.'
        )
      }
    }

    console.log('tsConfig ', tsConfig)
    console.log('file ', file)
  } catch (error) {
    console.error(error)

    // Refactor when control flow analysis of aliased conditions works with `useUnknownInCatchVariables`
    // @see https://github.com/microsoft/TypeScript/issues/44880
    const message = error instanceof VSCodeError ? error.message : 'Something went wrong!'
    const detail = error instanceof VSCodeError ? error.detail : error instanceof Error ? error.message : undefined

    window.showErrorMessage(message, { detail, modal: true })
  }
}
