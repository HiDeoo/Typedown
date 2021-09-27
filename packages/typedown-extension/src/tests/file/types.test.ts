import { assertMarkdownDefinitions, fileToMd, withFixture } from '../utils'

const fixture = 'file/src/types.ts'

describe('types', () => {
  it('should not export a type not aliasing an object type literal', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['TypeAlias'])

      return assertMarkdownDefinitions(markdown, [])
    }))

  it('should export an aliased object type literal of intrinsic types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithIntrinsicTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithIntrinsicTypes',
          children: [
            { name: 'a', type: 'boolean' },
            { name: 'b', type: 'string' },
            { name: 'c', type: 'number' },
          ],
        },
      ])
    }))

  it('should export an aliased object type literal of array types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithArrayTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithArrayTypes',
          children: [
            { name: 'a', type: 'boolean[]' },
            { name: 'b', type: 'string[]' },
            { name: 'c', type: 'number[]' },
          ],
        },
      ])
    }))

  it('should export an aliased object type literal of literal types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithLiteralTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithLiteralTypes',
          children: [
            { name: 'a', type: 'false' },
            { name: 'b', type: "'test'" },
            { name: 'c', type: 'null' },
            { name: 'd', type: '4' },
          ],
        },
      ])
    }))

  it('should export an aliased object type literal of intersection types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithIntersectionTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithIntersectionTypes',
          children: [
            { name: 'a', type: 'WithIntrinsicTypes & WithArrayTypes' },
            { name: 'b', type: 'TestTypeA & TestTypeB' },
          ],
        },
      ])
    }))

  it('should export an aliased object type literal of tuple types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithTupleTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithTupleTypes',
          children: [
            { name: 'a', type: '[boolean, number]' },
            { name: 'b', type: '[number, string?]' },
            { name: 'c', type: '[boolean, ...number[]]' },
          ],
        },
      ])
    }))

  it('should export an aliased object type literal of union types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithUnionTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithUnionTypes',
          children: [
            { name: 'a', type: 'string | number' },
            { name: 'b', type: 'string | TestTypeA' },
          ],
        },
      ])
    }))

  it('should export an aliased object type literal of union array types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithUnionArrayTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithUnionArrayTypes',
          children: [
            { name: 'a', type: '(number | string)[]' },
            { name: 'b', type: 'boolean | number[]' },
          ],
        },
      ])
    }))

  it('should export an aliased object type literal of optional types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithOptionalTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithOptionalTypes',
          children: [
            { name: 'a', type: 'number', optional: true },
            { name: 'b', type: 'string' },
            { name: 'c', type: 'boolean[]', optional: true },
          ],
        },
      ])
    }))

  it('should export an aliased object type literal with property default values', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithPropertyDefaultValues'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithPropertyDefaultValues',
          children: [
            { name: 'a', type: 'number', optional: true, defaultValue: '8080' },
            { name: 'b', type: 'string', optional: true, defaultValue: 'development' },
          ],
        },
      ])
    }))

  it('should export an aliased object type literal with property descriptions', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithPropertyDescriptions'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithPropertyDescriptions',
          children: [
            { name: 'a', type: 'number[]', description: 'Description A' },
            { name: 'b', type: 'string' },
            { name: 'c', type: 'boolean', description: 'Description C multiline.' },
            { name: 'd', type: 'boolean[]', description: 'Description D' },
          ],
        },
      ])
    }))

  it('should export an aliased object type literal of function types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithFunctionTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithFunctionTypes',
          children: [
            { name: 'a', type: '() => boolean' },
            { name: 'b', type: '(b1: number, b2?: string) => null' },
            { name: 'c', type: '(...c1: number[]) => string' },
            { name: 'd', type: '(d1: (d1a: string, d1b?: number) => boolean) => [boolean, string]' },
            { name: 'e', type: '(e1: string) => [number, boolean]' },
          ],
        },
      ])
    }))

  it('should export an aliased object type literal without the readonly property keyword', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithReadOnlyTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithReadOnlyTypes',
          children: [
            { name: 'a', type: 'number' },
            { name: 'b', type: 'boolean' },
            { name: 'c', type: '() => boolean' },
          ],
        },
      ])
    }))

  it('should export an aliased object type literal with the readonly keyword for array and tuple types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithReadonlyTupleAndArrayTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithReadonlyTupleAndArrayTypes',
          children: [
            { name: 'a', type: 'readonly [number, boolean]' },
            { name: 'b', type: 'readonly number[]' },
          ],
        },
      ])
    }))

  it('should export an aliased object type literal with generics', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithGenerics<T, U>'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithGenerics<T, U>',
          children: [
            { name: 'a', type: 'T[]' },
            { name: 'b', type: '(...b1: U[]) => U | [T]' },
          ],
        },
      ])
    }))

  it('should export an aliased object type literal with generic constraints', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithGenericConstraints<T extends string, U extends keyof TestTypeB>'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithGenericConstraints<T extends string, U extends keyof TestTypeB>',
          children: [
            { name: 'a', type: '(b1: T) => U[]' },
            { name: 'b', type: 'U | T' },
          ],
        },
      ])
    }))

  it('should export an aliased object type literal with type operator types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithTypeOperatorTypes<T extends keyof TestTypeA>'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithTypeOperatorTypes<T extends keyof TestTypeA>',
          children: [
            { name: 'a', type: 'T[]' },
            { name: 'b', type: 'keyof TestTypeA' },
          ],
        },
      ])
    }))

  it('should export an aliased object type literal with reference type arguments', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithReferenceTypeArguments'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithReferenceTypeArguments',
          children: [
            { name: 'a', type: 'Record<string, TestTypeA>' },
            { name: 'b', type: "Omit<TestTypeB, 'c'>" },
            { name: 'c', type: "Partial<Omit<TestTypeA, 'a' | 'b'>>" },
          ],
        },
      ])
    }))

  it('should export an aliased object type literal with reference types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithReferenceTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithReferenceTypes',
          children: [
            { name: 'a', type: 'TestTypeA' },
            { name: 'b', type: 'TestTypeB' },
            { name: 'c', type: 'TestTypeC' },
            { name: 'd', type: 'TestTypeD', optional: true },
          ],
        },
      ])
    }))

  it('should export an aliased object type literal with a description', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithDescriptions'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithDescriptions',
          description: 'Description',
          children: [
            { name: 'a', type: 'boolean' },
            { name: 'b', type: 'string' },
            { name: 'c', type: 'number[]', description: 'Description C' },
          ],
        },
      ])
    }))
})
