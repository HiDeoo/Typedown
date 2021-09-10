import { Uri } from 'vscode'
import * as TypeDoc from 'typedoc'
import { isSchema, Schema } from 'typedown-shared'

import { uriExists, TypedownError } from './vscode'

export async function getFolderTSConfig(uri: Uri): Promise<Uri> {
  const tsConfigURI = Uri.joinPath(uri, 'tsconfig.json')

  const tsConfigExists = await uriExists(tsConfigURI)

  if (!tsConfigExists) {
    throw new TypedownError('Could not find a TSConfig file in your workspace.')
  }

  return tsConfigURI
}

export function getSchema(tsConfig: Uri, currentFile: Uri): Schema {
  const app = new TypeDoc.Application()
  app.options.addReader(new TypeDoc.TSConfigReader())

  app.bootstrap({
    tsconfig: tsConfig.fsPath,
    entryPoints: [currentFile.fsPath],
  })

  const reflections = app.convert()

  if (!reflections) {
    throw new TypedownError('Could not generate definitions for your TypeScript project.')
  }

  const schema = app.serializer.projectToObject(reflections)

  if (!isSchema(schema) || schema.children.length === 0) {
    throw new TypedownError(
      'Could not generate definitions for your TypeScript project.',
      'Please make sure to export at least 1 type in your project.'
    )
  }

  return schema
}
