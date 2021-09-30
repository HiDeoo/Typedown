import * as TypeDoc from 'typedoc'
import { Definition, DefinitionChild, DefinitionKind } from 'typedown-shared'

import type { DeclarationReflection } from './typescript'

export function getDefinitionFromReflection(reflection: DeclarationReflection): Definition | undefined {
  if (isInterface(reflection) || isObjectTypeAlias(reflection)) {
    return getInterfaceOrObjectTypeAliasDefinition(reflection)
  } else if (isTypeAlias(reflection)) {
    return getTypeAliasDefinition(reflection)
  }

  return
}

function getInterfaceOrObjectTypeAliasDefinition(reflection: DeclarationReflection): Definition | undefined {
  const children = getChildren(reflection)

  if (children.length === 0) {
    return
  }

  return {
    children,
    description: getDescription(reflection),
    id: reflection.id,
    kind:
      reflection.kind === TypeDoc.ReflectionKind.Interface ? DefinitionKind.Interface : DefinitionKind.ObjectTypeAlias,
    name: getName(reflection),
  }
}

function getTypeAliasDefinition(reflection: DeclarationReflection): Definition {
  return {
    description: getDescription(reflection),
    id: reflection.id,
    kind: DefinitionKind.TypeAlias,
    name: getName(reflection),
    type: getType(reflection),
  }
}

function getName(reflection: DeclarationReflection): string {
  let name = reflection.name

  if (reflection.typeParameter) {
    name = `${name}<${reflection.typeParameter.map(getTypeParemeterType).join(', ')}>`
  }

  return name
}

function getDescription(reflection: DeclarationReflection): string {
  const description = reflection.comment?.shortText ?? ''

  return description.replace(/(?:\r\n?|\n)/, ' ')
}

function getChildren(reflection: DeclarationReflection): DefinitionChild[] {
  if (isMappedType(reflection.type)) {
    return [getChild(reflection)]
  } else if (isObjectTypeAlias(reflection)) {
    return getChildren(reflection.type.declaration)
  }

  const children: DefinitionChild[] = []

  if (reflection.indexSignature) {
    children.push(getChild(reflection.indexSignature))
  }

  if (!reflection.children || reflection.children.length === 0) {
    return children
  }

  children.push(...reflection.children.map(getChild))

  return children
}

function getChild(reflection: DeclarationReflection): DefinitionChild {
  return [
    getChildName(reflection),
    getDescription(reflection),
    getType(reflection),
    isOptional(reflection),
    getChildDefaultValue(reflection),
  ]
}

function getChildName(reflection: DeclarationOrSignatureReflection): string {
  if (isSignatureReflection(reflection) && reflection.parameters?.[0]) {
    const parameter = reflection.parameters?.[0]

    return `[${parameter.name}: ${getType(parameter)}]`
  } else if (isMappedType(reflection.type)) {
    return `[${reflection.type.parameter} in ${getType(reflection.type.parameterType)}]`
  }

  return reflection.name
}

function getChildDefaultValue(reflection: DeclarationReflection): string {
  const defaultTag = reflection.comment?.tags?.find(({ tag }) => tag === 'default')

  if (!defaultTag) {
    return ''
  }

  return defaultTag.text.replace(/(?:\r\n?|\n)+$/, '')
}

function getType(reflectionOrType: DeclarationReflection | SomeType): string {
  if (isObjectLiteralReflection(reflectionOrType)) {
    return getObjectLiteralType(reflectionOrType)
  }

  const type = isDeclarationReflection(reflectionOrType) ? reflectionOrType.type : reflectionOrType

  if (type) {
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
    } else if (isReflectionType(type)) {
      return getType(type.declaration)
    } else if (isTypeOperatorType(type)) {
      return getTypeOperatorType(type)
    } else if (isMappedType(type)) {
      return getType(type.templateType)
    } else if (isConditionalType(type)) {
      return getConditionalType(type)
    } else if (isInferredType(type)) {
      return getInferredType(type)
    } else if (isPredicateType(type)) {
      return getPredicateType(type)
    } else if (isQueryType(type)) {
      return getQueryType(type)
    } else if (isTemplateLiteralType(type)) {
      return getTemplateLiteralType(type)
    }
  } else if (isDeclarationReflection(reflectionOrType)) {
    const reflection = reflectionOrType

    if (reflection.signatures) {
      return reflection.signatures.map(getSignatureType).join('\n')
    }
  }

  return 'unknown'
}

function getIntrinsicType(type: TypeDoc.JSONOutput.IntrinsicType): string {
  return type.name
}

function getArrayType(type: TypeDoc.JSONOutput.ArrayType): string {
  let elementType = getType(type.elementType)

  if (isUnionType(type.elementType)) {
    elementType = `(${elementType})`
  }

  return `${elementType}[]`
}

function getIndexedAccessType(type: TypeDoc.JSONOutput.IndexedAccessType): string {
  return `${getType(type.objectType)}["${getType(type.indexType)}"]`
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
  return type.types.map(getType).join(' & ')
}

function getReferenceType(type: TypeDoc.JSONOutput.ReferenceType): string {
  let reference = type.name

  if (type.typeArguments) {
    const args = type.typeArguments.map(getType)

    reference = `${reference}<${args.join(', ')}>`
  }

  return reference
}

function getTupleType(type: TypeDoc.JSONOutput.TupleType): string {
  if (!type.elements) {
    return '[]'
  }

  return `[${type.elements.map(getType).join(', ')}]`
}

function getOptionalType(type: TypeDoc.JSONOutput.OptionalType): string {
  return `${getType(type.elementType)}?`
}

function getRestType(type: TypeDoc.JSONOutput.RestType): string {
  return `...${getType(type.elementType)}`
}

function getUnionType(type: TypeDoc.JSONOutput.UnionType): string {
  return type.types.map(getType).join(' | ')
}

function getConditionalType(type: TypeDoc.JSONOutput.ConditionalType): string {
  return `${getType(type.checkType)} extends ${getType(type.extendsType)} ? ${getType(type.trueType)} : ${getType(
    type.falseType
  )}`
}

function getInferredType(type: TypeDoc.JSONOutput.InferredType): string {
  return `infer ${type.name}`
}

function getPredicateType(type: TypeDoc.JSONOutput.PredicateType): string {
  if (!type.targetType) {
    return 'unknown'
  }

  return `${type.asserts ? 'asserts ' : ''}${type.name} is ${getType(type.targetType)}`
}

function getQueryType(type: TypeDoc.JSONOutput.QueryType): string {
  return `typeof ${getType(type.queryType)}`
}

function getTemplateLiteralType(type: TypeDoc.JSONOutput.TemplateLiteralType): string {
  const components = [type.head]

  components.push(
    ...type.tail.reduce<string[]>((acc, [tailType, tailString]) => {
      const maybeReferenceType = tailType as SomeType

      if (isReferenceType(maybeReferenceType)) {
        acc.push(`$\{${maybeReferenceType.name}}${tailString}`)
      }

      return acc
    }, [])
  )

  return `\`${components.join('')}\``
}

function getTypeOperatorType(type: TypeDoc.JSONOutput.TypeOperatorType): string {
  return `${type.operator} ${getType(type.target)}`
}

function getSignatureType(signature: TypeDoc.JSONOutput.SignatureReflection): string {
  const parameters = signature.parameters?.map(getParameterType) ?? []
  const returnType = signature.type ? getType(signature.type) : ''

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

  parameterComponents.push(getType(parameter.type ?? parameter))

  return parameterComponents.join('')
}

function getTypeParemeterType(typeParameter: TypeDoc.JSONOutput.TypeParameterReflection): string {
  let type = typeParameter.name

  if (typeParameter.type) {
    type = `${type} extends ${getType(typeParameter)}`
  }

  return type
}

function getObjectLiteralType(reflection: ObjectLiteralReflection): string {
  const children = getChildren(reflection)

  if (children.length === 0) {
    return '{}'
  }

  const properties = children.map((child) => `${child[0]}${child[3] ? '?' : ''}: ${child[2]}`)

  return `{ ${properties.join('; ')} }`
}

function isOptional(reflection: DeclarationReflection): boolean {
  return (
    reflection.flags.isOptional === true || (isMappedType(reflection.type) && reflection.type.optionalModifier === '+')
  )
}

function isSignatureReflection(
  reflection: DeclarationOrSignatureReflection
): reflection is TypeDoc.JSONOutput.SignatureReflection {
  return reflection.kind === TypeDoc.ReflectionKind.IndexSignature
}

function isIntrinsicType(someType: SomeType): someType is TypeDoc.JSONOutput.IntrinsicType {
  return someType.type === 'intrinsic'
}

function isArrayType(someType: SomeType): someType is TypeDoc.JSONOutput.ArrayType {
  return someType.type === 'array'
}

function isIndexedAccessType(someType: SomeType): someType is TypeDoc.JSONOutput.IndexedAccessType {
  return someType.type === 'indexedAccess'
}

function isLiteralType(someType: SomeType): someType is TypeDoc.JSONOutput.LiteralType {
  return someType.type === 'literal'
}

function isIntersectionType(someType: SomeType): someType is TypeDoc.JSONOutput.IntersectionType {
  return someType.type === 'intersection'
}

function isReferenceType(someType: SomeType): someType is TypeDoc.JSONOutput.ReferenceType {
  return someType.type === 'reference'
}

function isTupleType(someType: SomeType): someType is TypeDoc.JSONOutput.TupleType {
  return someType.type === 'tuple'
}

function isOptionalType(someType: SomeType): someType is TypeDoc.JSONOutput.OptionalType {
  return someType.type === 'optional'
}

function isRestType(someType: SomeType): someType is TypeDoc.JSONOutput.RestType {
  return someType.type === 'rest'
}

function isUnionType(someType: SomeType): someType is TypeDoc.JSONOutput.UnionType {
  return someType.type === 'union'
}

function isReflectionType(someType?: SomeType): someType is ReflectionTypeWithDeclaration {
  return (
    someType?.type === 'reflection' && typeof (someType as ReflectionTypeWithDeclaration).declaration !== 'undefined'
  )
}

function isTypeOperatorType(someType: SomeType): someType is TypeDoc.JSONOutput.TypeOperatorType {
  return someType.type === 'typeOperator'
}

function isMappedType(someType?: SomeType): someType is TypeDoc.JSONOutput.MappedType {
  return typeof someType !== 'undefined' && someType.type === 'mapped'
}

function isConditionalType(someType: SomeType): someType is TypeDoc.JSONOutput.ConditionalType {
  return someType.type === 'conditional'
}

function isInferredType(someType: SomeType): someType is TypeDoc.JSONOutput.InferredType {
  return someType.type === 'inferred'
}

function isPredicateType(someType: SomeType): someType is TypeDoc.JSONOutput.PredicateType {
  return someType.type === 'predicate'
}

function isQueryType(someType: SomeType): someType is TypeDoc.JSONOutput.QueryType {
  return someType.type === 'query'
}

function isTemplateLiteralType(someType: SomeType): someType is TypeDoc.JSONOutput.TemplateLiteralType {
  return someType.type === 'template-literal'
}

function isInterface(reflection: DeclarationReflection): boolean {
  return reflection.kind === TypeDoc.ReflectionKind.Interface
}

function isTypeAlias(reflection: DeclarationReflection): boolean {
  return reflection.kind === TypeDoc.ReflectionKind.TypeAlias
}

function isObjectTypeAlias(reflection: DeclarationReflection): reflection is ObjectTypeAlias {
  return (
    (reflection.kind === TypeDoc.ReflectionKind.TypeAlias &&
      isReflectionType(reflection.type) &&
      typeof reflection.type.declaration.children !== 'undefined') ||
    isMappedType(reflection.type)
  )
}

function isDeclarationReflection(
  declarationReflectionOrType: DeclarationReflection | SomeType
): declarationReflectionOrType is DeclarationReflection {
  return typeof (declarationReflectionOrType as DeclarationReflection).kind !== 'undefined'
}

function isObjectLiteralReflection(
  declarationReflectionOrType: DeclarationReflection | SomeType
): declarationReflectionOrType is ObjectLiteralReflection {
  return (
    isDeclarationReflection(declarationReflectionOrType) && typeof declarationReflectionOrType.children !== 'undefined'
  )
}

type SomeType = TypeDoc.JSONOutput.SomeType | TypeDoc.JSONOutput.MappedType | TypeDoc.JSONOutput.TemplateLiteralType

type DeclarationOrSignatureReflection = DeclarationReflection | TypeDoc.JSONOutput.SignatureReflection

interface ReflectionTypeWithDeclaration extends TypeDoc.JSONOutput.ReflectionType {
  declaration: NonNullable<TypeDoc.JSONOutput.ReflectionType['declaration']>
  type: TypeDoc.JSONOutput.ReflectionType['type']
}

interface ObjectTypeAlias extends DeclarationReflection {
  kind: TypeDoc.ReflectionKind.TypeAlias
  type: ReflectionTypeWithDeclaration
}

interface ObjectLiteralReflection extends DeclarationReflection {
  children: DeclarationReflection[]
}
