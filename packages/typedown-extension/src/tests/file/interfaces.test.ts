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

  it('should export an interface of optional types', () =>
    withFixture('file/src/interfaces.ts', async () => {
      const markdown = await fileToMd(['WithOptionalTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithOptionalTypes',
          children: [
            { name: 'a', type: 'string', optional: true },
            { name: 'b', type: 'number[]', optional: true },
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

  it('should ignore the readonly keyword in an interface', () =>
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
})
