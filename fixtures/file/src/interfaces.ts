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

export interface WithDefaultValueTypes {
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

interface TestInterfaceA {
  a: string
  b: number
}

interface TestInterfaceB {
  c: boolean
  d: string
}
