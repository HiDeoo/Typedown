import type { Definitions } from 'typedown-shared'
import { assertMarkdownDefinitions, fileToMd, getDefinitionsFromFixture } from '../utils'

describe('interfaces', () => {
  let definitions: Definitions = []

  before(async () => {
    definitions = await getDefinitionsFromFixture('file/src/interfaces.ts', fileToMd)
  })

  it('should not export an empty interface', () => assertMarkdownDefinitions(definitions, []))

  it('should export an interface with intrinsic types', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithIntrinsicTypes',
        children: [
          { name: 'a', type: 'string' },
          { name: 'b', type: 'number' },
          { name: 'c', type: 'boolean' },
        ],
      },
    ]))

  it('should export an interface with array types', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithArrayTypes',
        children: [
          { name: 'a', type: 'string[]' },
          { name: 'b', type: 'number[]' },
          { name: 'c', type: 'boolean[]' },
        ],
      },
    ]))

  it('should export an interface with literal types', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithLiteralTypes',
        children: [
          { name: 'a', type: 'null' },
          { name: 'b', type: '3' },
          { name: 'c', type: 'true' },
          { name: 'd', type: "'test'" },
        ],
      },
    ]))

  it('should export an interface with intersection types', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithIntersectionTypes',
        children: [
          { name: 'a', type: 'WithIntrinsicTypes & WithArrayTypes' },
          { name: 'b', type: 'TestInterfaceA & TestInterfaceB' },
          { name: 'c', type: 'TestInterfaceB & { a?: boolean; b: string }' },
        ],
      },
    ]))

  it('should export an interface with tuple types', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithTupleTypes',
        children: [
          { name: 'a', type: '[number, string]' },
          { name: 'b', type: '[string, number?]' },
          { name: 'c', type: '[string, ...boolean[]]' },
        ],
      },
    ]))

  it('should export an interface with union types', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithUnionTypes',
        children: [
          { name: 'a', type: 'string | boolean' },
          { name: 'b', type: 'number | TestInterfaceA' },
          { name: 'c', type: 'TestInterfaceB | { a?: boolean; b: string }' },
        ],
      },
    ]))

  it('should export an interface with union array types', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithUnionArrayTypes',
        children: [
          { name: 'a', type: '(string | boolean)[]' },
          { name: 'b', type: 'number | boolean[]' },
        ],
      },
    ]))

  it('should export an interface with optional types', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithOptionalTypes',
        children: [
          { name: 'a', type: 'string', optional: true },
          { name: 'b', type: 'number[]', optional: true },
          { name: 'c', type: 'boolean' },
        ],
      },
    ]))

  it('should export an interface with property default values', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithPropertyDefaultValues',
        children: [
          { name: 'a', type: 'string', optional: true, defaultValue: 'production' },
          { name: 'b', type: 'boolean', optional: true, defaultValue: 'true' },
        ],
      },
    ]))

  it('should export an interface with property descriptions', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithPropertyDescriptions',
        children: [
          { name: 'a', type: 'string', description: 'Description A' },
          { name: 'b', type: 'number' },
          { name: 'c', type: 'boolean', description: 'Description C1 multiline. Description C2' },
          { name: 'd', type: 'string[]', description: 'Description D' },
          { name: 'e', type: 'number', description: 'Description E' },
        ],
      },
    ]))

  it('should export an interface with function types', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithFunctionTypes',
        children: [
          { name: 'a', type: '() => string' },
          { name: 'b', type: '(b1: string, b2?: number) => void' },
          { name: 'c', type: '(...c1: string[]) => boolean' },
          { name: 'd', type: '(d1: (d1a: number, d1b?: boolean) => void) => [string, number]' },
          { name: 'e', type: '(e1: boolean) => [string, number]' },
        ],
      },
    ]))

  it('should export an interface with a string index signature', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithStringIndexSignature',
        children: [
          { name: '[keyA: string]', type: 'boolean' },
          { name: 'b', type: 'boolean' },
        ],
      },
    ]))

  it('should export an interface with a number index signature', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithNumberIndexSignature',
        children: [
          { name: '[keyA: number]', type: 'string' },
          { name: 'b', type: 'number' },
        ],
      },
    ]))

  it('should export an interface with only an index signature', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithOnlyIndexSignature',
        children: [{ name: '[key: string]', type: 'number[]' }],
      },
    ]))

  it('should export an interface without the readonly property keyword', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithReadOnlyTypes',
        children: [
          { name: 'a', type: 'string' },
          { name: 'b', type: 'number' },
          { name: 'c', type: '() => string' },
        ],
      },
    ]))

  it('should export an interface with the readonly keyword for array and tuple types', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithReadonlyTupleAndArrayTypes',
        children: [
          { name: 'a', type: 'readonly [string, number]' },
          { name: 'b', type: 'readonly boolean[]' },
        ],
      },
    ]))

  it('should export an interface extending other ones', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithExtends',
        children: [
          { name: 'e', type: 'string | number' },
          { name: 'a', type: 'string' },
          { name: 'b', type: 'number' },
          { name: 'c', type: 'boolean' },
          { name: 'd', type: 'string' },
        ],
      },
    ]))

  it('should export an interface extending other ones with reference type arguments', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithReferenceTypeArgumentsExtends',
        children: [
          { name: 'e', type: 'number' },
          { name: 'b', type: 'number' },
          { name: 'c', type: 'boolean', optional: true },
          { name: 'd', type: 'string', optional: true },
        ],
      },
    ]))

  it('should export an interface with generics', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithGenerics<T, U>',
        children: [
          { name: 'a', type: 'T' },
          { name: 'b', type: '(...b1: U[]) => T' },
        ],
      },
    ]))

  it('should export an interface with generic constraints', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithGenericConstraints<T extends string, U extends keyof TestInterfaceA>',
        children: [
          { name: 'a', type: 'T' },
          { name: 'b', type: '(b1: U) => [T]' },
        ],
      },
    ]))

  it('should export an interface with type operator types', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithTypeOperatorTypes<T extends keyof TestInterfaceA>',
        children: [
          { name: 'a', type: 'T' },
          { name: 'b', type: 'keyof TestInterfaceB' },
        ],
      },
    ]))

  it('should export an interface with reference type arguments', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithReferenceTypeArguments',
        children: [
          { name: 'a', type: "Omit<TestInterfaceA, 'a' | 'b'>" },
          { name: 'b', type: "Partial<Omit<TestInterfaceA, 'a' | 'b'>>" },
          { name: 'c', type: 'Record<string, boolean>' },
        ],
      },
    ]))

  it('should export an interface with reference types', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithReferenceTypes',
        children: [
          { name: 'a', type: 'TestInterfaceA' },
          { name: 'b', type: 'TestInterfaceB', optional: true },
          { name: 'c', type: 'string' },
          { name: 'd', type: 'TestInterfaceD' },
        ],
      },
    ]))

  it('should export an interface with predicate types', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithPredicateTypes',
        children: [
          { name: 'a', type: '(a1: TestInterfaceA | TestInterfaceB) => a1 is TestInterfaceA' },
          { name: 'b', type: '(b1: boolean | string[]) => asserts b1 is boolean' },
        ],
      },
    ]))

  it('should export an interface with query types', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithQueryTypes',
        children: [
          { name: 'a', type: '(a1: string) => number' },
          { name: 'b', type: 'number' },
        ],
      },
    ]))

  it('should export an interface with nested object literal types', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithNestedObjectLiteralTypes',
        children: [
          { name: 'a', type: '{ a1: number[]; a2: string | number }', optional: true },
          { name: 'b', type: 'number' },
          { name: 'c', type: '{ c1: { c1a: number; c1b: string[] }; c2: boolean }' },
        ],
      },
    ]))

  it('should export an interface with a description', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithDescriptions',
        description: 'Description',
        children: [
          { name: 'a', type: 'string' },
          { name: 'b', type: 'number', description: 'Description B' },
          { name: 'c', type: 'boolean' },
        ],
      },
    ]))

  it('should export an interface with a description tag', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithDescriptionTags',
        description: 'Description',
        children: [
          { name: 'a', type: 'string', description: 'Description A' },
          { name: 'b', type: 'number', description: 'Description B1 Description B2' },
        ],
      },
    ]))
})
