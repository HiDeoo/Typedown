import type * as TypeDoc from 'typedoc'
import type { Definitions } from 'typedown-shared'

import {
  isArrayType,
  isIndexedAccessType,
  isIntersectionType,
  isIntrinsicType,
  isLiteralType,
  isOptionalType,
  isReferenceType,
  isTupleType,
} from './typescript'

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
    return getIntrinsicTypeMarkdown(type)
  } else if (isArrayType(type)) {
    return getArrayTypeMarkdown(type)
  } else if (isIndexedAccessType(type)) {
    return getIndexedAccessMarkdown(type)
  } else if (isLiteralType(type)) {
    return getLiteralTypeMarkdown(type)
  } else if (isIntersectionType(type)) {
    return getIntersectionTypeMarkdown(type)
  } else if (isReferenceType(type)) {
    return getReferenceTypeMarkdown(type)
  } else if (isTupleType(type)) {
    return getTupleTypeMarkdown(type)
  } else if (isOptionalType(type)) {
    return getOptionalTypeMarkdown(type)
  }

  return 'unknown'
}

function getIntrinsicTypeMarkdown(type: TypeDoc.JSONOutput.IntrinsicType): string {
  return type.name
}

function getArrayTypeMarkdown(type: TypeDoc.JSONOutput.ArrayType): string {
  return `${getTypeMarkdown(type.elementType)}[]`
}

function getIndexedAccessMarkdown(type: TypeDoc.JSONOutput.IndexedAccessType): string {
  return `${getTypeMarkdown(type.objectType)}["${getTypeMarkdown(type.indexType)}"]`
}

function getLiteralTypeMarkdown(type: TypeDoc.JSONOutput.LiteralType): string {
  if (!type.value) {
    return 'null'
  }

  switch (typeof type.value) {
    case 'number': {
      return type.value.toString()
    }
    case 'boolean': {
      return type.value ? 'true' : 'false'
    }
    case 'object': {
      return `${type.value.negative ? '-' : ''}${type.value.value}`
    }
    default: {
      return `'${type.value}'`
    }
  }
}

function getIntersectionTypeMarkdown(type: TypeDoc.JSONOutput.IntersectionType): string {
  return type.types.map(getTypeMarkdown).join(' & ')
}

function getReferenceTypeMarkdown(type: TypeDoc.JSONOutput.ReferenceType): string {
  return type.name
}

function getTupleTypeMarkdown(type: TypeDoc.JSONOutput.TupleType): string {
  if (!type.elements) {
    return '[]'
  }

  return `[${type.elements.map(getTypeMarkdown).join(', ')}]`
}

function getOptionalTypeMarkdown(type: TypeDoc.JSONOutput.OptionalType): string {
  return `${getTypeMarkdown(type.elementType)}?`
}
