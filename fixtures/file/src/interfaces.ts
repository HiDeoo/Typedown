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

interface TestInterfaceA {
  a: string
  b: number
}

interface TestInterfaceB {
  c: boolean
  d: string
}
