import { IntrinsicType, LiteralType, WithIntrinsicTypes } from './types'
import type { QueryType, ReadonlyArrayType } from './types'

import { WithArrayTypes, WithLiteralTypes } from './interfaces'
import type { WithGenerics } from './interfaces'

export type ImportedType = IntrinsicType

export type WithImportedTypes = {
  a: WithIntrinsicTypes
  b?: QueryType
  c: ReadonlyArrayType | LiteralType
}

export interface WithImportedInterfaces extends WithArrayTypes {
  d?: WithLiteralTypes
  e: WithGenerics<string, number[]>
}
