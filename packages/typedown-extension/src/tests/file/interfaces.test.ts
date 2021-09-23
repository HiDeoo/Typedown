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
})
