import { Uri, window, workspace, WorkspaceFolder } from 'vscode'

export function getWorkspaceSingleFolder(): WorkspaceFolder {
  const folders = workspace.workspaceFolders
  const folder = folders?.[0]

  if (!folders || !folder) {
    throw new VSCodeError(
      'Could not find a valid workspace folder.',
      'Please make sure to open your TypeScript project folder in VS Code.'
    )
  } else if (folders.length !== 1) {
    throw new VSCodeError(
      'Multiple folders opened in your current workspace.',
      'Please make sure to only open a single TypeScript project folder in VS Code.'
    )
  }

  return folder
}

export async function getActiveTextEditorDiskURI(): Promise<Uri> {
  if (!window.activeTextEditor) {
    throw new Error('Could not find an active text editor.')
  }

  const uri = window.activeTextEditor.document.uri
  const exists = await uriExists(uri)

  if (!exists) {
    throw new Error('The active text editor is not a file on disk.')
  }

  return uri
}

export async function uriExists(uri: Uri): Promise<boolean> {
  try {
    await workspace.fs.stat(uri)

    return true
  } catch (error) {
    return false
  }
}

export class VSCodeError extends Error {
  constructor(message: string, public detail?: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export type MaybeURI = Uri | undefined
