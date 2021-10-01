export type InterfaceIntersectionType = TestInterfaceA & TestInterfaceB

export type WithInterfaceTypes = {
  a: TestInterfaceA
  b?: TestInterfaceB
}

export interface WithTypesInterfaces {
  a: TestTypeA
  b?: TestTypeB
}

interface TestInterfaceA {
  a: string
  b: boolean
}

interface TestInterfaceB {
  c: number[]
  d?: [string, boolean]
}

type TestTypeA = 'test'

type TestTypeB = {
  a: string
  b?: boolean[]
}
