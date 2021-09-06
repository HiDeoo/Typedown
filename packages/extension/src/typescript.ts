import { Uri } from 'vscode'
import * as schemaGenerator from 'ts-json-schema-generator'

import { MaybeURI, uriExists, VSCodeError } from './vscode'

export async function getFolderTSConfig(uri: Uri): Promise<MaybeURI> {
  const tsConfigURI = Uri.joinPath(uri, 'tsconfig.json')

  const tsConfigExists = await uriExists(tsConfigURI)

  return tsConfigExists ? tsConfigURI : undefined
}

export function getSchema(tsConfig: MaybeURI, currentFile: MaybeURI): TSSchema {
  const config: schemaGenerator.Config = {
    path: currentFile?.fsPath,
    skipTypeCheck: true,
    tsconfig: tsConfig?.fsPath,
    type: '*',
  }

  try {
    return schemaGenerator.createGenerator(config).createSchema(config.type)
  } catch (error) {
    throw new VSCodeError(
      'Could not generate definitions for your TypeScript project.',
      error instanceof Error ? error.message : undefined
    )
  }
}

export type TSSchema = schemaGenerator.Schema
