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
}

export interface WithTupleTypes {
  a: [number, string]
  b: [string, number?]
  c: [string, ...boolean[]]
}

export interface WithUnionTypes {
  a: string | boolean
  b: number | TestInterfaceA
}

export interface WithOptionalTypes {
  a?: string
  b?: number[]
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
   * Description C
   * multiline.
   */
  c: boolean
  /**
   * Description D
   *
   * Multiline
   */
  d: string[]
}

export interface WithFunctionTypes {
  a: () => string
  b: (b1: string, b2?: number) => void
  c: (...c1: string[]) => boolean
  d(d1: (d1a: number, d1b?: boolean) => void): [string, number]
  e(e1: boolean): [string, number]
}

export interface WithIndexSignature {
  a: true | false
  [keyB: string]: boolean
}

export interface WithReadOnlyTypes {
  readonly a: string
  b: number
  readonly c: () => string
}

export interface WithExtends extends TestInterfaceA, TestInterfaceB {
  e: string | number
}

interface TestInterfaceA {
  a: string
  b: number
}

interface TestInterfaceB {
  c: boolean
  d: string
}
