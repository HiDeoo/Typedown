import * as TypeDoc from 'typedoc'
import type { Definition, DefinitionChild } from 'typedown-shared'

import type { DeclarationReflection } from './typescript'

export function getDefinitionFromReflection(reflection: DeclarationReflection): Definition | undefined {
  const children = getDefinitionChildren(reflection)

  if (children.length === 0) {
    return
  }

  return {
    children,
    description: getCommentDescription(reflection.comment),
    id: reflection.id,
    name: getDefinitionName(reflection),
  }
}

function getDefinitionName(reflection: TypeDoc.JSONOutput.DeclarationReflection): string {
  let name = reflection.name

  if (reflection.typeParameter) {
    name = `${name}<${reflection.typeParameter.map(getTypeParemeterType).join(', ')}>`
  }

  return name
}

function getCommentDescription(comment?: TypeDoc.JSONOutput.Comment): string {
  const description = comment?.shortText ?? ''

  return description.replace(/(?:\r\n?|\n)/, ' ')
}

function getDefinitionChildren(reflection: TypeDoc.JSONOutput.DeclarationReflection): DefinitionChild[] {
  // Aliased object type literal.
  if (reflection.type && isReflectionType(reflection.type) && reflection.type.declaration) {
    return getDefinitionChildren(reflection.type.declaration)
  } else if (reflection.type && isMappedType(reflection.type)) {
    return [getDefinitionChild(reflection)]
  }

  const children: DefinitionChild[] = []

  if (!reflection.children || reflection.children.length === 0) {
    return children
  }

  children.push(...reflection.children.map(getDefinitionChild))

  if (reflection.indexSignature) {
    children.push(getDefinitionChild(reflection.indexSignature))
  }

  return children
}

function getDefinitionChild(reflection: DeclarationOrSignatureReflection): DefinitionChild {
  return [
    getDefinitionChildName(reflection),
    getCommentDescription(reflection.comment),
    getDefinitionChildType(reflection),
    isReflectionOptional(reflection),
    getDefinitionChildDefaultValue(reflection.comment),
  ]
}

function getDefinitionChildName(reflection: DeclarationOrSignatureReflection): string {
  if (isSignatureReflection(reflection) && reflection.parameters?.[0]) {
    const parameter = reflection.parameters?.[0]

    return `[${parameter.name}: ${getDefinitionChildType(parameter)}]`
  } else if (reflection.type && isMappedType(reflection.type)) {
    return `[${reflection.type.parameter} in ${getDefinitionChildDirectType(reflection.type.parameterType)}]`
  }

  return reflection.name
}

function getDefinitionChildDefaultValue(comment?: TypeDoc.JSONOutput.Comment): string {
  const defaultTag = comment?.tags?.find(({ tag }) => tag === 'default')

  if (!defaultTag) {
    return ''
  }

  return defaultTag.text.replace(/(?:\r\n?|\n)+$/, '')
}

function getDefinitionChildType(reflection: TypeDoc.JSONOutput.DeclarationReflection): string {
  return reflection.type ? getDefinitionChildDirectType(reflection.type) : getDefinitionChildIndirectType(reflection)
}

function getDefinitionChildDirectType(type: SomeType): string {
  if (isIntrinsicType(type)) {
    return getIntrinsicType(type)
  } else if (isArrayType(type)) {
    return getArrayType(type)
  } else if (isIndexedAccessType(type)) {
    return getIndexedAccessType(type)
  } else if (isLiteralType(type)) {
    return getLiteralType(type)
  } else if (isIntersectionType(type)) {
    return getIntersectionType(type)
  } else if (isReferenceType(type)) {
    return getReferenceType(type)
  } else if (isTupleType(type)) {
    return getTupleType(type)
  } else if (isOptionalType(type)) {
    return getOptionalType(type)
  } else if (isRestType(type)) {
    return getRestType(type)
  } else if (isUnionType(type)) {
    return getUnionType(type)
  } else if (isReflectionType(type) && type.declaration) {
    return getDefinitionChildType(type.declaration)
  } else if (isTypeOperatorType(type)) {
    return getTypeOperatorType(type)
  } else if (isMappedType(type)) {
    return getDefinitionChildDirectType(type.templateType)
  }

  return 'unknown'
}

function getDefinitionChildIndirectType(reflection: TypeDoc.JSONOutput.DeclarationReflection): string {
  if (reflection.signatures) {
    return reflection.signatures.map(getSignatureType).join('\n')
  }

  return 'unknown'
}

function getIntrinsicType(type: TypeDoc.JSONOutput.IntrinsicType): string {
  return type.name
}

function getArrayType(type: TypeDoc.JSONOutput.ArrayType): string {
  let elementType = getDefinitionChildDirectType(type.elementType)

  if (isUnionType(type.elementType)) {
    elementType = `(${elementType})`
  }

  return `${elementType}[]`
}

function getIndexedAccessType(type: TypeDoc.JSONOutput.IndexedAccessType): string {
  return `${getDefinitionChildDirectType(type.objectType)}["${getDefinitionChildDirectType(type.indexType)}"]`
}

function getLiteralType(type: TypeDoc.JSONOutput.LiteralType): string {
  if (type.value == null) {
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

function getIntersectionType(type: TypeDoc.JSONOutput.IntersectionType): string {
  return type.types.map(getDefinitionChildDirectType).join(' & ')
}

function getReferenceType(type: TypeDoc.JSONOutput.ReferenceType): string {
  let reference = type.name

  if (type.typeArguments) {
    const args = type.typeArguments.map(getDefinitionChildDirectType)

    reference = `${reference}<${args.join(', ')}>`
  }

  return reference
}

function getTupleType(type: TypeDoc.JSONOutput.TupleType): string {
  if (!type.elements) {
    return '[]'
  }

  return `[${type.elements.map(getDefinitionChildDirectType).join(', ')}]`
}

function getOptionalType(type: TypeDoc.JSONOutput.OptionalType): string {
  return `${getDefinitionChildDirectType(type.elementType)}?`
}

function getRestType(type: TypeDoc.JSONOutput.RestType): string {
  return `...${getDefinitionChildDirectType(type.elementType)}`
}

function getUnionType(type: TypeDoc.JSONOutput.UnionType): string {
  return type.types.map(getDefinitionChildDirectType).join(' | ')
}

function getTypeOperatorType(type: TypeDoc.JSONOutput.TypeOperatorType): string {
  return `${type.operator} ${getDefinitionChildDirectType(type.target)}`
}

function getSignatureType(signature: TypeDoc.JSONOutput.SignatureReflection): string {
  const parameters = signature.parameters?.map(getParameterType) ?? []
  const returnType = signature.type ? getDefinitionChildDirectType(signature.type) : ''

  return `(${parameters.join(', ')}) => ${returnType}`
}

function getParameterType(parameter: TypeDoc.JSONOutput.ParameterReflection): string {
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

function getTypeParemeterType(typeParameter: TypeDoc.JSONOutput.TypeParameterReflection): string {
  let type = typeParameter.name

  if (typeParameter.type) {
    type = `${type} extends ${getDefinitionChildType(typeParameter)}`
  }

  return type
}

function isReflectionOptional(reflection: TypeDoc.JSONOutput.DeclarationReflection): boolean {
  return reflection.flags.isOptional === true
}

function isSignatureReflection(
  reflection: DeclarationOrSignatureReflection
): reflection is TypeDoc.JSONOutput.SignatureReflection {
  return reflection.kind === TypeDoc.ReflectionKind.IndexSignature
}

function isIntrinsicType(type: SomeType): type is TypeDoc.JSONOutput.IntrinsicType {
  return type.type === 'intrinsic'
}

function isArrayType(type: SomeType): type is TypeDoc.JSONOutput.ArrayType {
  return type.type === 'array'
}

function isIndexedAccessType(type: SomeType): type is TypeDoc.JSONOutput.IndexedAccessType {
  return type.type === 'indexedAccess'
}

function isLiteralType(type: SomeType): type is TypeDoc.JSONOutput.LiteralType {
  return type.type === 'literal'
}

function isIntersectionType(type: SomeType): type is TypeDoc.JSONOutput.IntersectionType {
  return type.type === 'intersection'
}

function isReferenceType(type: SomeType): type is TypeDoc.JSONOutput.ReferenceType {
  return type.type === 'reference'
}

function isTupleType(type: SomeType): type is TypeDoc.JSONOutput.TupleType {
  return type.type === 'tuple'
}

function isOptionalType(type: SomeType): type is TypeDoc.JSONOutput.OptionalType {
  return type.type === 'optional'
}

function isRestType(type: SomeType): type is TypeDoc.JSONOutput.RestType {
  return type.type === 'rest'
}

function isUnionType(type: SomeType): type is TypeDoc.JSONOutput.UnionType {
  return type.type === 'union'
}

function isReflectionType(type: SomeType): type is TypeDoc.JSONOutput.ReflectionType {
  return type.type === 'reflection'
}

function isTypeOperatorType(type: SomeType): type is TypeDoc.JSONOutput.TypeOperatorType {
  return type.type === 'typeOperator'
}

function isMappedType(type: SomeType): type is TypeDoc.JSONOutput.MappedType {
  return type.type === 'mapped'
}

type SomeType = TypeDoc.JSONOutput.SomeType | TypeDoc.JSONOutput.MappedType

type DeclarationOrSignatureReflection =
  | TypeDoc.JSONOutput.DeclarationReflection
  | TypeDoc.JSONOutput.SignatureReflection
