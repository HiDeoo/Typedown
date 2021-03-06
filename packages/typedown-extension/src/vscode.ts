import { QuickPickItem, Uri, window, workspace, WorkspaceFolder } from 'vscode'
import { sync as glob } from 'glob'
import gitignoreToGlob from 'gitignore-to-glob'

export function getWorkspaceSingleFolder(): WorkspaceFolder {
  const folders = workspace.workspaceFolders
  const folder = folders?.[0]

  if (!folders || !folder) {
    throw new TypedownError(
      'Could not find a valid workspace folder.',
      'Please make sure to open your TypeScript project folder in VS Code.'
    )
  } else if (folders.length !== 1) {
    throw new TypedownError(
      'Multiple folders opened in your current workspace.',
      'Please make sure to only open a single TypeScript project folder in VS Code.'
    )
  }

  return folder
}

export async function getActiveTextEditorDiskURI(): Promise<Uri> {
  if (!window.activeTextEditor) {
    throw new TypedownError('Could not find an active text editor.')
  }

  const uri = window.activeTextEditor.document.uri
  const exists = await uriExists(uri)

  if (!exists) {
    throw new TypedownError('The active text editor is not a file on disk.')
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

export async function pickWorkspaceFolder(): Promise<Uri | undefined> {
  const folder = getWorkspaceSingleFolder()
  const ignore = await getWorkspaceIgnoreGlobs(folder.uri)

  const items: WorkspaceFolderQuickPickItem[] = glob('**/', { cwd: folder.uri.fsPath, ignore }).map((relativePath) => ({
    absolutePath: Uri.joinPath(folder.uri, relativePath),
    label: `/${relativePath.slice(0, -1)}`,
  }))

  items.unshift({
    absolutePath: folder.uri,
    description: 'workspace root',
    label: '/',
  })

  const pickedFolder = await window.showQuickPick(items, {
    ignoreFocusOut: true,
    placeHolder: 'Select the folder containing the definitions to generate.',
  })

  return pickedFolder?.absolutePath
}

async function getWorkspaceIgnoreGlobs(location: Uri): Promise<string[]> {
  const ignoreGlobs: string[] = []

  const gitignoreUri = Uri.joinPath(location, '.gitignore')
  const exists = await uriExists(gitignoreUri)

  if (exists) {
    ignoreGlobs.push(...gitignoreToGlob(gitignoreUri.fsPath))
  }

  const filesExcludes = workspace.getConfiguration('files.exclude', location)

  ignoreGlobs.push(
    ...gitignoreToGlob(
      Object.keys(filesExcludes)
        .filter((filesExclude) => filesExcludes[filesExclude] === true)
        .join('\n'),
      { string: true }
    )
  )

  return ignoreGlobs.reduce<string[]>((acc, ignoreGlob) => {
    if (ignoreGlob.startsWith('!')) {
      acc.push(ignoreGlob.replace(/^!/, ''))
    }

    return acc
  }, [])
}

export class TypedownError extends Error {
  constructor(message: string, public detail?: string, public outputChannelOnlyDetail?: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

interface WorkspaceFolderQuickPickItem extends QuickPickItem {
  absolutePath: Uri
}
