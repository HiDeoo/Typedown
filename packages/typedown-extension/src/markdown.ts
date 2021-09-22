import type * as TypeDoc from 'typedoc'
import type { Definitions } from 'typedown-shared'

import { isArrayType, isIntrinsicType } from './typescript'

export function getDefinitionsMarkdown(definitions: Definitions): string {
  return definitions
    .reduce<string[]>((acc, definition) => {
      if (definition.children && definition.children.length > 0) {
        acc.push(`# ${definition.name}

${getDefinitionChildrenMarkdown(definition.children)}`)
      }

      return acc
    }, [])
    .join('\n\n')
}

function getDefinitionChildrenMarkdown(children: TypeDoc.JSONOutput.DeclarationReflection[]): string {
  return `| Name | Type |
| --- | --- |
${children.map(getDefinitionChildMarkdown).join('\n')}`
}

function getDefinitionChildMarkdown(child: TypeDoc.JSONOutput.DeclarationReflection): string {
  return `| ${child.name} | \`${getTypeMarkdown(child.type)}\` |`
}

function getTypeMarkdown(type?: TypeDoc.JSONOutput.SomeType): string {
  if (!type) {
    return ''
  } else if (isIntrinsicType(type)) {
    return type.name
  } else if (isArrayType(type)) {
    return `${getTypeMarkdown(type.elementType)}[]`
  }

  return 'unknown'
}
