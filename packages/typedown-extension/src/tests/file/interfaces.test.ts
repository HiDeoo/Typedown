import { assertMarkdownDefinitions, fileToMd, withFixture } from '../utils'

describe('interfaces', () => {
  it('should export an interface of intrinsic types', () =>
    withFixture('file/src/interfaces.ts', async () => {
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
    withFixture('file/src/interfaces.ts', async () => {
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
    withFixture('file/src/interfaces.ts', async () => {
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
    withFixture('file/src/interfaces.ts', async () => {
      const markdown = await fileToMd(['WithIntersectionTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithIntersectionTypes',
          children: [
            { name: 'a', type: 'WithIntrinsicTypes & WithArrayTypes' },
            { name: 'b', type: 'TestInterfaceA & TestInterfaceB' },
          ],
        },
      ])
    }))

  it('should export an interface of tuple types', () =>
    withFixture('file/src/interfaces.ts', async () => {
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
    withFixture('file/src/interfaces.ts', async () => {
      const markdown = await fileToMd(['WithUnionTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithUnionTypes',
          children: [
            { name: 'a', type: 'string | boolean' },
            { name: 'b', type: 'number | TestInterfaceA' },
          ],
        },
      ])
    }))

  it('should export an interface of union array types', () =>
    withFixture('file/src/interfaces.ts', async () => {
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
    withFixture('file/src/interfaces.ts', async () => {
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
    withFixture('file/src/interfaces.ts', async () => {
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
    withFixture('file/src/interfaces.ts', async () => {
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
    withFixture('file/src/interfaces.ts', async () => {
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

  it('should export an interface with an index signature', () =>
    withFixture('file/src/interfaces.ts', async () => {
      const markdown = await fileToMd(['WithIndexSignature'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithIndexSignature',
          children: [
            { name: 'a', type: 'boolean' },
            { name: '[keyB: string]', type: 'boolean' },
          ],
        },
      ])
    }))

  it('should export an interface without the readonly property keyword', () =>
    withFixture('file/src/interfaces.ts', async () => {
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
    withFixture('file/src/interfaces.ts', async () => {
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
    withFixture('file/src/interfaces.ts', async () => {
      const markdown = await fileToMd(['WithExtends'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithExtends',
          children: [
            { name: 'a', type: 'string' },
            { name: 'b', type: 'number' },
            { name: 'c', type: 'boolean' },
            { name: 'd', type: 'string' },
            { name: 'e', type: 'string | number' },
          ],
        },
      ])
    }))

  it('should export an interface extending other ones with reference type arguments', () =>
    withFixture('file/src/interfaces.ts', async () => {
      const markdown = await fileToMd(['WithReferenceTypeArgumentsExtends'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithReferenceTypeArgumentsExtends',
          children: [
            { name: 'b', type: 'number' },
            { name: 'c', type: 'boolean', optional: true },
            { name: 'd', type: 'string', optional: true },
            { name: 'e', type: 'number' },
          ],
        },
      ])
    }))

  it('should export an interface with generics', () =>
    withFixture('file/src/interfaces.ts', async () => {
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
    withFixture('file/src/interfaces.ts', async () => {
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
    withFixture('file/src/interfaces.ts', async () => {
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
    withFixture('file/src/interfaces.ts', async () => {
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
    withFixture('file/src/interfaces.ts', async () => {
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
})
