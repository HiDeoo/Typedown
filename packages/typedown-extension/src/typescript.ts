import { Uri } from 'vscode'
import * as TypeDoc from 'typedoc'
import { Definition, Definitions } from 'typedown-shared'

import { uriExists, TypedownError } from './vscode'

export async function getFolderTSConfig(uri: Uri): Promise<Uri> {
  const tsConfigURI = Uri.joinPath(uri, 'tsconfig.json')

  const tsConfigExists = await uriExists(tsConfigURI)

  if (!tsConfigExists) {
    throw new TypedownError('Could not find a TSConfig file in your workspace.')
  }

  return tsConfigURI
}

export function getDefinitions(tsConfig: Uri, currentFile: Uri): Definitions {
  const schema = getSchema(tsConfig, currentFile)

  const definitions = schema.children.filter(isValidDefinition)

  if (definitions.length === 0) {
    throw new TypedownError(
      'Could not generate definitions for your TypeScript project.',
      'Please make sure to export at least 1 supported type in your project.'
    )
  }

  return definitions
}

function getSchema(tsConfig: Uri, currentFile: Uri): SchemaWithChildren {
  const app = new TypeDoc.Application()
  app.options.addReader(new TypeDoc.TSConfigReader())

  app.bootstrap({
    disableSources: true,
    emit: false,
    entryPoints: [currentFile.fsPath],
    excludeInternal: true,
    excludePrivate: true,
    excludeProtected: true,
    readme: 'none',
    tsconfig: tsConfig.fsPath,
  })

  const reflections = app.convert()

  if (!reflections) {
    throw new TypedownError('Could not generate definitions for your TypeScript project.')
  }

  const schema = app.serializer.projectToObject(reflections)

  if (!isSchemaWithChildren(schema) || schema.children.length === 0) {
    throw new TypedownError(
      'Could not generate definitions for your TypeScript project.',
      'Please make sure to export at least 1 type in your project.'
    )
  }

  return schema
}

function isValidDefinition(definition: Definition): boolean {
  return definition.kindString !== 'Function'
}

function isSchemaWithChildren(schema: TypeDoc.JSONOutput.ProjectReflection): schema is SchemaWithChildren {
  return typeof schema.children !== 'undefined'
}

interface SchemaWithChildren extends TypeDoc.JSONOutput.ProjectReflection {
  children: Definitions
}
