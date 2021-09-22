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

interface TestInterfaceA {
  a: string
  b: number
}

interface TestInterfaceB {
  c: boolean
  d: string
}
