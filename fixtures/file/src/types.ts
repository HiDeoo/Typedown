export type WithIntrinsicTypes = {
  a: boolean
  b: string
  c: number
}

export type WithArrayTypes = {
  a: boolean[]
  b: string[]
  c: number[]
}

export type WithLiteralTypes = {
  a: false
  b: 'test'
  c: null
  d: 4
}

export type WithIntersectionTypes = {
  a: WithIntrinsicTypes & WithArrayTypes
  b: TestTypeA & TestTypeB
}

export type WithTupleTypes = {
  a: [boolean, number]
  b: [number, string?]
  c: [boolean, ...number[]]
}

export type WithUnionTypes = {
  a: string | number
  b: string | TestTypeA
}

export type WithUnionArrayTypes = {
  a: (number | string)[]
  b: boolean | number[]
}

export type WithOptionalTypes = {
  a?: number
  b: string
  c?: boolean[]
}

export type WithPropertyDefaultValues = {
  /**
   * @author HiDeoo
   * @default 8080
   * @see https://github.com/HiDeoo/Typedown/
   */
  a?: number
  /**
   * @default development
   */
  b?: string
}

export type WithPropertyDescriptions = {
  /**
   * Description A
   */
  a: number[]
  // Description B
  b: string
  /**
   * Description C
   * multiline.
   */
  c: boolean
  /**
   * Description D
   *
   * Multiline
   */
  d: boolean[]
}

export type WithFunctionTypes = {
  a: () => boolean
  b: (b1: number, b2?: string) => null
  c: (...c1: number[]) => string
  d(d1: (d1a: string, d1b?: number) => boolean): [boolean, string]
  e(e1: string): [number, boolean]
}

export type WithReadOnlyTypes = {
  readonly a: number
  b: boolean
  readonly c: () => boolean
}

export type WithReadonlyTupleAndArrayTypes = {
  a: readonly [number, boolean]
  b: readonly number[]
}

export type WithGenerics<T, U> = {
  a: T[]
  b: (...b1: U[]) => U | [T]
}

export type WithGenericConstraints<T extends string, U extends keyof TestTypeB> = {
  a: (b1: T) => U[]
  b: U | T
}

export type WithTypeOperatorTypes<T extends keyof TestTypeA> = {
  a: T[]
  b: keyof TestTypeA
}

export type WithReferenceTypeArguments = {
  a: Record<string, TestTypeA>
  b: Omit<TestTypeB, 'c'>
  c: Partial<Omit<TestTypeA, 'a' | 'b'>>
}

export type WithReferenceTypes = {
  a: TestTypeA
  b: TestTypeB
  c: TestTypeC
  d?: TestTypeD
}

/**
 * Description
 */
export type WithDescriptions = {
  a: boolean
  b: string
  /**
   * Description C
   */
  c: number[]
}

export type WithMappedType<T> = {
  [key in keyof T]: number | boolean
}

export type WithMappedTypeOptionalModifier<T> = {
  [key in keyof T]+?: boolean
}

export type WithMappedTypeReadonlyModifier<T> = {
  +readonly [key in keyof T]: number[]
}

export type TypeAlias = string

type TestTypeA = {
  a: boolean
  b: string
}

type TestTypeB = {
  c: string
  d: number
}

type TestTypeC = number

type TestTypeD = string & { da: boolean[] }
