import { Uri } from 'vscode'

import { uriExists } from './vscode'

export async function getFolderTSConfig(uri: Uri): Promise<Uri | undefined> {
  const tsConfigURI = Uri.joinPath(uri, 'tsconfig.json')

  const tsConfigExists = await uriExists(tsConfigURI)

  return tsConfigExists ? tsConfigURI : undefined
}
