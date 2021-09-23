import * as TypeDoc from 'typedoc'
import type { Definition, DefinitionChild } from 'typedown-shared'

import type { DeclarationReflection } from './typescript'

export function getDefinitionFromReflection(reflection: DeclarationReflection): Definition | undefined {
  if (!reflection.children || reflection.children.length === 0) {
    return
  }

  return {
    children: getDefinitionChildren(reflection.children),
    id: reflection.id,
    name: reflection.name,
  }
}

function getDefinitionChildren(reflections: TypeDoc.JSONOutput.DeclarationReflection[]): DefinitionChild[] {
  return reflections.map(getDefinitionChild)
}

function getDefinitionChild(reflection: TypeDoc.JSONOutput.DeclarationReflection): DefinitionChild {
  return [
    reflection.name,
    getDefinitionChildDescription(reflection.comment),
    getDefinitionChildType(reflection),
    reflection.flags.isOptional === true,
    getDefinitionChildDefaultValue(reflection.comment),
  ]
}

function getDefinitionChildDefaultValue(comment?: TypeDoc.JSONOutput.Comment): string {
  const defaultTag = comment?.tags?.find(({ tag }) => tag === 'default')

  if (!defaultTag) {
    return ''
  }

  return defaultTag.text.replace(/(?:\r\n?|\n)+$/, '')
}

function getDefinitionChildDescription(comment?: TypeDoc.JSONOutput.Comment): string {
  const description = comment?.shortText ?? ''

  return description.replace(/(?:\r\n?|\n)/, ' ')
}

function getDefinitionChildType(reflection: TypeDoc.JSONOutput.DeclarationReflection): string {
  return reflection.type ? getDefinitionChildDirectType(reflection.type) : getDefinitionChildIndirectType(reflection)
}

function getDefinitionChildDirectType(type: TypeDoc.JSONOutput.SomeType): string {
  if (isIntrinsicType(type)) {
    return getIntrinsicTypeMarkdown(type)
  } else if (isArrayType(type)) {
    return getArrayTypeMarkdown(type)
  } else if (isIndexedAccessType(type)) {
    return getIndexedAccessTypeMarkdown(type)
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
  } else if (isRestType(type)) {
    return getRestTypeMarkdown(type)
  } else if (isUnionType(type)) {
    return getUnionTypeMarkdown(type)
  } else if (isReflectionType(type) && type.declaration) {
    return getDefinitionChildType(type.declaration)
  }

  return 'unknown'
}

function getDefinitionChildIndirectType(reflection: TypeDoc.JSONOutput.DeclarationReflection): string {
  if (reflection.signatures) {
    return reflection.signatures.map(getSignatureTypeMarkdown).join('\n')
  }

  return 'unknown'
}

function getIntrinsicTypeMarkdown(type: TypeDoc.JSONOutput.IntrinsicType): string {
  return type.name
}

function getArrayTypeMarkdown(type: TypeDoc.JSONOutput.ArrayType): string {
  return `${getDefinitionChildDirectType(type.elementType)}[]`
}

function getIndexedAccessTypeMarkdown(type: TypeDoc.JSONOutput.IndexedAccessType): string {
  return `${getDefinitionChildDirectType(type.objectType)}["${getDefinitionChildDirectType(type.indexType)}"]`
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
  return type.types.map(getDefinitionChildDirectType).join(' & ')
}

function getReferenceTypeMarkdown(type: TypeDoc.JSONOutput.ReferenceType): string {
  return type.name
}

function getTupleTypeMarkdown(type: TypeDoc.JSONOutput.TupleType): string {
  if (!type.elements) {
    return '[]'
  }

  return `[${type.elements.map(getDefinitionChildDirectType).join(', ')}]`
}

function getOptionalTypeMarkdown(type: TypeDoc.JSONOutput.OptionalType): string {
  return `${getDefinitionChildDirectType(type.elementType)}?`
}

function getRestTypeMarkdown(type: TypeDoc.JSONOutput.RestType): string {
  return `...${getDefinitionChildDirectType(type.elementType)}`
}

function getUnionTypeMarkdown(type: TypeDoc.JSONOutput.UnionType): string {
  return type.types.map(getDefinitionChildDirectType).join(' | ')
}

function getSignatureTypeMarkdown(signature: TypeDoc.JSONOutput.SignatureReflection): string {
  const parameters = signature.parameters?.map(getParameterTypeMarkdown) ?? []
  const returnType = signature.type ? getDefinitionChildDirectType(signature.type) : ''

  return `(${parameters.join(', ')}) => ${returnType}`
}

function getParameterTypeMarkdown(parameter: TypeDoc.JSONOutput.ParameterReflection): string {
  const parameterComponents: string[] = []

  if (parameter.flags.isRest) {
    parameterComponents.push('...')
  }

  parameterComponents.push(parameter.name)

  if (parameter.flags.isOptional) {
    parameterComponents.push('?')
  }

  parameterComponents.push(': ')

  parameterComponents.push(
    parameter.type ? getDefinitionChildDirectType(parameter.type) : getDefinitionChildIndirectType(parameter)
  )

  return parameterComponents.join('')
}

function isIntrinsicType(type: TypeDoc.JSONOutput.SomeType): type is TypeDoc.JSONOutput.IntrinsicType {
  return type.type === 'intrinsic'
}

function isArrayType(type: TypeDoc.JSONOutput.SomeType): type is TypeDoc.JSONOutput.ArrayType {
  return type.type === 'array'
}

function isIndexedAccessType(type: TypeDoc.JSONOutput.SomeType): type is TypeDoc.JSONOutput.IndexedAccessType {
  return type.type === 'indexedAccess'
}

function isLiteralType(type: TypeDoc.JSONOutput.SomeType): type is TypeDoc.JSONOutput.LiteralType {
  return type.type === 'literal'
}

function isIntersectionType(type: TypeDoc.JSONOutput.SomeType): type is TypeDoc.JSONOutput.IntersectionType {
  return type.type === 'intersection'
}

function isReferenceType(type: TypeDoc.JSONOutput.SomeType): type is TypeDoc.JSONOutput.ReferenceType {
  return type.type === 'reference'
}

function isTupleType(type: TypeDoc.JSONOutput.SomeType): type is TypeDoc.JSONOutput.TupleType {
  return type.type === 'tuple'
}

function isOptionalType(type: TypeDoc.JSONOutput.SomeType): type is TypeDoc.JSONOutput.OptionalType {
  return type.type === 'optional'
}

function isRestType(type: TypeDoc.JSONOutput.SomeType): type is TypeDoc.JSONOutput.RestType {
  return type.type === 'rest'
}

function isUnionType(type: TypeDoc.JSONOutput.SomeType): type is TypeDoc.JSONOutput.UnionType {
  return type.type === 'union'
}

function isReflectionType(type: TypeDoc.JSONOutput.SomeType): type is TypeDoc.JSONOutput.ReflectionType {
  return type.type === 'reflection'
}
