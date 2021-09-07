import { Uri } from 'vscode'
import * as schemaGenerator from 'ts-json-schema-generator'
import { isSchema, Schema } from 'typedown-shared'

import { MaybeURI, uriExists, VSCodeError } from './vscode'

export async function getFolderTSConfig(uri: Uri): Promise<MaybeURI> {
  const tsConfigURI = Uri.joinPath(uri, 'tsconfig.json')

  const tsConfigExists = await uriExists(tsConfigURI)

  return tsConfigExists ? tsConfigURI : undefined
}

export function getSchema(tsConfig: MaybeURI, currentFile: MaybeURI): Schema {
  const config: schemaGenerator.Config = {
    path: currentFile?.fsPath,
    skipTypeCheck: true,
    tsconfig: tsConfig?.fsPath,
    type: '*',
  }

  try {
    const schema = schemaGenerator.createGenerator(config).createSchema(config.type)

    if (!isSchema(schema) || Object.keys(schema.definitions).length === 0) {
      throw new Error('Please make sure to export at least 1 type in your project.')
    }

    return schema
  } catch (error) {
    throw new VSCodeError(
      'Could not generate definitions for your TypeScript project.',
      error instanceof Error ? error.message : undefined
    )
  }
}
