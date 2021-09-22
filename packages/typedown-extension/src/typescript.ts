import { Uri } from 'vscode'
import * as TypeDoc from 'typedoc'
import { Definition, Definitions } from 'typedown-shared'
import { findConfigFile } from 'typescript'
import { existsSync } from 'fs'

import { TypedownError } from './vscode'

export async function getFolderTSConfig(uri: Uri): Promise<Uri> {
  const tsConfigPath = findConfigFile(uri.fsPath, existsSync)

  if (!tsConfigPath) {
    throw new TypedownError('Could not find a TSConfig file for your workspace.')
  }

  return Uri.file(tsConfigPath)
}

export function getDefinitions(tsConfig: Uri, entryPoint: Uri): Definitions {
  const schema = getSchema(tsConfig, entryPoint)

  const definitions = filterDefinitions(schema.children)

  if (definitions.length === 0) {
    throw new TypedownError(
      'Could not generate definitions for your TypeScript project.',
      'Please make sure to export at least 1 supported type in your project.'
    )
  }

  return definitions
}

function getSchema(tsConfig: Uri, entryPoint: Uri): ReflectionWithChildren {
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
    tsconfig: tsConfig.fsPath,
  })

  const reflections = app.convert()

  if (!reflections) {
    throw new TypedownError('Could not generate definitions for your TypeScript project.')
  }

  const schema = app.serializer.projectToObject(reflections)

  if (!isReflectionWithChildren(schema) || schema.children.length === 0) {
    throw new TypedownError(
      'Could not generate definitions for your TypeScript project.',
      'Please make sure to export at least 1 type in your project.'
    )
  }

  return schema
}

function filterDefinitions(definitions: Definitions): Definitions {
  return definitions.reduce<Definitions>((acc, definition) => {
    if (isValidDefinition(definition)) {
      acc.push(definition)
    } else if (isModuleReflectionWithChildren(definition)) {
      acc.push(...filterDefinitions(definition.children))
    }

    return acc
  }, [])
}

function isValidDefinition(definition: Definition): boolean {
  return definition.kind === TypeDoc.ReflectionKind.Interface
}

function isReflectionWithChildren(
  reflection: TypeDoc.JSONOutput.ProjectReflection
): reflection is ReflectionWithChildren {
  return typeof reflection.children !== 'undefined'
}

function isModuleReflectionWithChildren(
  reflection: TypeDoc.JSONOutput.ProjectReflection
): reflection is ReflectionWithChildren {
  return isReflectionWithChildren(reflection) && reflection.kind === TypeDoc.ReflectionKind.Module
}

export function isIntrinsicType(type: TypeDoc.JSONOutput.SomeType): type is TypeDoc.JSONOutput.IntrinsicType {
  return type.type === 'intrinsic'
}

export function isArrayType(type: TypeDoc.JSONOutput.SomeType): type is TypeDoc.JSONOutput.ArrayType {
  return type.type === 'array'
}

export function isIndexedAccessType(type: TypeDoc.JSONOutput.SomeType): type is TypeDoc.JSONOutput.IndexedAccessType {
  return type.type === 'indexedAccess'
}

export function isLiteralType(type: TypeDoc.JSONOutput.SomeType): type is TypeDoc.JSONOutput.LiteralType {
  return type.type === 'literal'
}

export function isIntersectionType(type: TypeDoc.JSONOutput.SomeType): type is TypeDoc.JSONOutput.IntersectionType {
  return type.type === 'intersection'
}

export function isReferenceType(type: TypeDoc.JSONOutput.SomeType): type is TypeDoc.JSONOutput.ReferenceType {
  return type.type === 'reference'
}

interface ReflectionWithChildren extends TypeDoc.JSONOutput.ProjectReflection {
  children: Definitions
}
