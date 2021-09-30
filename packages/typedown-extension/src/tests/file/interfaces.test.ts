import { assertMarkdownDefinitions, fileToMd, withFixture } from '../utils'

const fixture = 'file/src/interfaces.ts'

describe('interfaces', () => {
  it('should not export an empty interface', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['EmptyInterface'])

      return assertMarkdownDefinitions(markdown, [])
    }))

  it('should export an interface of intrinsic types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithIntrinsicTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithIntrinsicTypes',
          children: [
            { name: 'a', type: 'string' },
            { name: 'b', type: 'number' },
            { name: 'c', type: 'boolean' },
          ],
        },
      ])
    }))

  it('should export an interface of array types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithArrayTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithArrayTypes',
          children: [
            { name: 'a', type: 'string[]' },
            { name: 'b', type: 'number[]' },
            { name: 'c', type: 'boolean[]' },
          ],
        },
      ])
    }))

  it('should export an interface of literal types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithLiteralTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithLiteralTypes',
          children: [
            { name: 'a', type: 'null' },
            { name: 'b', type: '3' },
            { name: 'c', type: 'true' },
            { name: 'd', type: "'test'" },
          ],
        },
      ])
    }))

  it('should export an interface of intersection types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithIntersectionTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithIntersectionTypes',
          children: [
            { name: 'a', type: 'WithIntrinsicTypes & WithArrayTypes' },
            { name: 'b', type: 'TestInterfaceA & TestInterfaceB' },
            { name: 'c', type: 'TestInterfaceB & { a?: boolean; b: string }' },
          ],
        },
      ])
    }))

  it('should export an interface of tuple types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithTupleTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithTupleTypes',
          children: [
            { name: 'a', type: '[number, string]' },
            { name: 'b', type: '[string, number?]' },
            { name: 'c', type: '[string, ...boolean[]]' },
          ],
        },
      ])
    }))

  it('should export an interface of union types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithUnionTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithUnionTypes',
          children: [
            { name: 'a', type: 'string | boolean' },
            { name: 'b', type: 'number | TestInterfaceA' },
            { name: 'c', type: 'TestInterfaceB | { a?: boolean; b: string }' },
          ],
        },
      ])
    }))

  it('should export an interface of union array types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithUnionArrayTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithUnionArrayTypes',
          children: [
            { name: 'a', type: '(string | boolean)[]' },
            { name: 'b', type: 'number | boolean[]' },
          ],
        },
      ])
    }))

  it('should export an interface of optional types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithOptionalTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithOptionalTypes',
          children: [
            { name: 'a', type: 'string', optional: true },
            { name: 'b', type: 'number[]', optional: true },
            { name: 'c', type: 'boolean' },
          ],
        },
      ])
    }))

  it('should export an interface with property default values', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithPropertyDefaultValues'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithPropertyDefaultValues',
          children: [
            { name: 'a', type: 'string', optional: true, defaultValue: 'production' },
            { name: 'b', type: 'boolean', optional: true, defaultValue: 'true' },
          ],
        },
      ])
    }))

  it('should export an interface with property descriptions', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithPropertyDescriptions'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithPropertyDescriptions',
          children: [
            { name: 'a', type: 'string', description: 'Description A' },
            { name: 'b', type: 'number' },
            { name: 'c', type: 'boolean', description: 'Description C multiline.' },
            { name: 'd', type: 'string[]', description: 'Description D' },
          ],
        },
      ])
    }))

  it('should export an interface of function types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithFunctionTypes'])

      return assertMarkdownDefinitions(markdown, [
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
      ])
    }))

  it('should export an interface with a string index signature', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithStringIndexSignature'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithStringIndexSignature',
          children: [
            { name: '[keyA: string]', type: 'boolean' },
            { name: 'b', type: 'boolean' },
          ],
        },
      ])
    }))

  it('should export an interface with a number index signature', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithNumberIndexSignature'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithNumberIndexSignature',
          children: [
            { name: '[keyA: number]', type: 'string' },
            { name: 'b', type: 'number' },
          ],
        },
      ])
    }))

  it('should export an interface with only an index signature', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithOnlyIndexSignature'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithOnlyIndexSignature',
          children: [{ name: '[key: string]', type: 'number[]' }],
        },
      ])
    }))

  it('should export an interface without the readonly property keyword', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithReadOnlyTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithReadOnlyTypes',
          children: [
            { name: 'a', type: 'string' },
            { name: 'b', type: 'number' },
            { name: 'c', type: '() => string' },
          ],
        },
      ])
    }))

  it('should export an interface with the readonly keyword for array and tuple types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithReadonlyTupleAndArrayTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithReadonlyTupleAndArrayTypes',
          children: [
            { name: 'a', type: 'readonly [string, number]' },
            { name: 'b', type: 'readonly boolean[]' },
          ],
        },
      ])
    }))

  it('should export an interface extending other ones', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithExtends'])

      return assertMarkdownDefinitions(markdown, [
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
      ])
    }))

  it('should export an interface extending other ones with reference type arguments', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithReferenceTypeArgumentsExtends'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithReferenceTypeArgumentsExtends',
          children: [
            { name: 'e', type: 'number' },
            { name: 'b', type: 'number' },
            { name: 'c', type: 'boolean', optional: true },
            { name: 'd', type: 'string', optional: true },
          ],
        },
      ])
    }))

  it('should export an interface with generics', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithGenerics<T, U>'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithGenerics<T, U>',
          children: [
            { name: 'a', type: 'T' },
            { name: 'b', type: '(...b1: U[]) => T' },
          ],
        },
      ])
    }))

  it('should export an interface with generic constraints', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithGenericConstraints<T extends string, U extends keyof TestInterfaceA>'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithGenericConstraints<T extends string, U extends keyof TestInterfaceA>',
          children: [
            { name: 'a', type: 'T' },
            { name: 'b', type: '(b1: U) => [T]' },
          ],
        },
      ])
    }))

  it('should export an interface with type operator types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithTypeOperatorTypes<T extends keyof TestInterfaceA>'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithTypeOperatorTypes<T extends keyof TestInterfaceA>',
          children: [
            { name: 'a', type: 'T' },
            { name: 'b', type: 'keyof TestInterfaceB' },
          ],
        },
      ])
    }))

  it('should export an interface with reference type arguments', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithReferenceTypeArguments'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithReferenceTypeArguments',
          children: [
            { name: 'a', type: "Omit<TestInterfaceA, 'a' | 'b'>" },
            { name: 'b', type: "Partial<Omit<TestInterfaceA, 'a' | 'b'>>" },
            { name: 'c', type: 'Record<string, boolean>' },
          ],
        },
      ])
    }))

  it('should export an interface with reference types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithReferenceTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithReferenceTypes',
          children: [
            { name: 'a', type: 'TestInterfaceA' },
            { name: 'b', type: 'TestInterfaceB', optional: true },
            { name: 'c', type: 'string' },
            { name: 'd', type: 'TestInterfaceD' },
          ],
        },
      ])
    }))

  it('should export an interface with predicate types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithPredicateTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithPredicateTypes',
          children: [
            { name: 'a', type: '(a1: TestInterfaceA | TestInterfaceB) => a1 is TestInterfaceA' },
            { name: 'b', type: '(b1: boolean | string[]) => asserts b1 is boolean' },
          ],
        },
      ])
    }))

  it('should export an interface with query types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithQueryTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithQueryTypes',
          children: [
            { name: 'a', type: '(a1: string) => number' },
            { name: 'b', type: 'number' },
          ],
        },
      ])
    }))

  it('should export an interface with nested object literal types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithNestedObjectLiteralTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithNestedObjectLiteralTypes',
          children: [
            { name: 'a', type: '{ a1: number[]; a2: string | number }', optional: true },
            { name: 'b', type: 'number' },
            { name: 'c', type: '{ c1: { c1a: number; c1b: string[] }; c2: boolean }' },
          ],
        },
      ])
    }))

  it('should export an interface with a description', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithDescriptions'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithDescriptions',
          description: 'Description',
          children: [
            { name: 'a', type: 'string' },
            { name: 'b', type: 'number', description: 'Description B' },
            { name: 'c', type: 'boolean' },
          ],
        },
      ])
    }))
})
