export interface WithIntrinsicTypes {
  a: string
  b: number
  c: boolean
}

export interface WithArrayTypes {
  a: string[]
  b: number[]
  c: boolean[]
}

export interface WithLiteralTypes {
  a: null
  b: 3
  c: true
  d: 'test'
}

export interface WithIntersectionTypes {
  a: WithIntrinsicTypes & WithArrayTypes
  b: TestInterfaceA & TestInterfaceB
  c: TestInterfaceB & { a?: boolean; b: string }
}

export interface WithTupleTypes {
  a: [number, string]
  b: [string, number?]
  c: [string, ...boolean[]]
}

export interface WithUnionTypes {
  a: string | boolean
  b: number | TestInterfaceA
  c: TestInterfaceB | { a?: boolean; b: string }
}

export interface WithUnionArrayTypes {
  a: (string | boolean)[]
  b: number | boolean[]
}

export interface WithOptionalTypes {
  a?: string
  b?: number[]
  c: boolean
}

export interface WithPropertyDefaultValues {
  /**
   * @deprecated
   * @default production
   * @see https://github.com/HiDeoo/Typedown/
   */
  a?: string
  /**
   * @default true
   */
  b?: boolean
}

export interface WithPropertyDescriptions {
  /**
   * Description A
   */
  a: string
  // Description B
  b: number
  /**
   * Description C1
   * multiline.
   * @description Description C2
   */
  c: boolean
  /**
   * Description D
   *
   * Multiline
   */
  d: string[]
  /**
   * @description Description E
   */
  e: number
}

export interface WithFunctionTypes {
  a: () => string
  b: (b1: string, b2?: number) => void
  c: (...c1: string[]) => boolean
  d(d1: (d1a: number, d1b?: boolean) => void): [string, number]
  e(e1: boolean): [string, number]
}

export interface WithStringIndexSignature {
  [keyA: string]: boolean
  b: true | false
}

export interface WithNumberIndexSignature {
  [keyA: number]: string
  b: number
}

export interface WithOnlyIndexSignature {
  [key: string]: number[]
}

export interface WithReadOnlyTypes {
  readonly a: string
  b: number
  readonly c: () => string
}

export interface WithReadonlyTupleAndArrayTypes {
  a: readonly [string, number]
  b: readonly boolean[]
}

export interface WithExtends extends TestInterfaceA, TestInterfaceB {
  e: string | number
}

export interface WithReferenceTypeArgumentsExtends extends Omit<TestInterfaceA, 'a'>, Partial<TestInterfaceB> {
  e: number
}

export interface WithGenerics<T, U> {
  a: T
  b: (...b1: U[]) => T
}

export interface WithGenericConstraints<T extends string, U extends keyof TestInterfaceA> {
  a: T
  b: (b1: U) => [T]
}

export interface WithTypeOperatorTypes<T extends keyof TestInterfaceA> {
  a: T
  b: keyof TestInterfaceB
}

export interface WithReferenceTypeArguments {
  a: Omit<TestInterfaceA, 'a' | 'b'>
  b: Partial<Omit<TestInterfaceA, 'a' | 'b'>>
  c: Record<string, boolean>
}

export interface WithReferenceTypes {
  a: TestInterfaceA
  b?: TestInterfaceB
  c: TestInterfaceC
  d: TestInterfaceD
}

export interface WithPredicateTypes {
  a: (a1: TestInterfaceA | TestInterfaceB) => a1 is TestInterfaceA
  b(b1: boolean | string[]): asserts b1 is boolean
}

export interface WithQueryTypes {
  a: (a1: string) => typeof testConstA
  b: typeof testConstA
}

export interface WithNestedObjectLiteralTypes {
  a?: { a1: number[]; a2: string | number }
  b: number
  c: { c1: { c1a: number; c1b: string[] }; c2: boolean }
}

/**
 * Description
 */
export interface WithDescriptions {
  a: string
  /**
   * Description B
   */
  b: number
  c: boolean
}

/**
 * @description Description
 */
export interface WithDescriptionTags {
  /**
   * @description Description A
   */
  a: string
  /**
   * Description B1
   * @description Description B2
   */
  b: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EmptyInterface {}

interface TestInterfaceA {
  a: string
  b: number
}

interface TestInterfaceB {
  c: boolean
  d: string
}

type TestInterfaceC = string

type TestInterfaceD = string & { da: boolean }

// eslint-disable-next-line @typescript-eslint/no-inferrable-types
const testConstA: number = 1
