import { Uri } from 'vscode'
import * as TypeDoc from 'typedoc'
import { DefinitionIdentifier, Definitions } from 'typedown-shared'
import { findConfigFile } from 'typescript'
import { existsSync } from 'fs'

import { TypedownError } from './vscode'
import { getDefinitionFromReflection } from './definitions'

export async function getFolderTSConfig(uri: Uri): Promise<Uri> {
  const tsConfigPath = findConfigFile(uri.fsPath, existsSync)

  if (!tsConfigPath) {
    throw new TypedownError('Could not find a TSConfig file for your workspace.')
  }

  return Uri.file(tsConfigPath)
}

export function getDefinitions(tsConfig: Uri, entryPoint: Uri): Definitions {
  const schema = getSchema(tsConfig, entryPoint)

  const definitions = getDefinitionsFromSchema(schema)

  if (definitions.length === 0) {
    throw new TypedownError(
      'Could not generate definitions for your TypeScript project.',
      'Please make sure to export at least 1 supported type in your project.'
    )
  }

  return definitions
}

function getSchema(tsConfig: Uri, entryPoint: Uri): Schema {
  const app = new TypeDoc.Application()
  app.options.addReader(new TypeDoc.TSConfigReader())

  app.bootstrap({
    disableSources: true,
    emit: false,
    entryPoints: [entryPoint.fsPath],
    excludeInternal: true,
    excludePrivate: true,
    excludeProtected: true,
    logger: 'none',
    readme: 'none',
    sort: ['source-order'],
    tsconfig: tsConfig.fsPath,
  })

  const reflections = app.convert()

  if (!reflections) {
    throw new TypedownError('Could not generate definitions for your TypeScript project.')
  }

  const reflection = app.serializer.projectToObject(reflections)

  if (!isSchema(reflection) || reflection.children.length === 0) {
    throw new TypedownError(
      'Could not generate definitions for your TypeScript project.',
      'Please make sure to export at least 1 type in your project.'
    )
  }

  return reflection
}

function getDefinitionsFromSchema(schema: Schema): Definitions {
  return schema.children.reduce<Definitions>((acc, reflection) => {
    if (isValidDeclarationReflection(reflection)) {
      const definition = getDefinitionFromReflection(reflection)

      if (definition) {
        acc.push(definition)
      }
    } else if (isValidModuleReflection(reflection)) {
      acc.push(...getDefinitionsFromSchema(reflection))
    }

    return acc
  }, [])
}

function isSchema(reflection: TypeDoc.JSONOutput.ProjectReflection): reflection is Schema {
  return typeof reflection.children !== 'undefined'
}

function isValidDeclarationReflection(reflection: DeclarationReflection): boolean {
  return reflection.kind === TypeDoc.ReflectionKind.Interface || reflection.kind === TypeDoc.ReflectionKind.TypeAlias
}

function isValidModuleReflection(reflection: TypeDoc.JSONOutput.ProjectReflection): reflection is Schema {
  return reflection.kind === TypeDoc.ReflectionKind.Module
}

interface Schema extends TypeDoc.JSONOutput.ProjectReflection {
  children: DeclarationReflection[]
}

export interface DeclarationReflection extends TypeDoc.JSONOutput.DeclarationReflection {
  id: DefinitionIdentifier
}
