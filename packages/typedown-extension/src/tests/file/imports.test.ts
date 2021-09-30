import { assertMarkdownDefinitions, fileToMd, withFixture } from '../utils'

const fixture = 'file/src/imports.ts'

describe.only('imports', () => {
  it('should export a type alias of imported type', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['ImportedType'])

      return assertMarkdownDefinitions(markdown, [{ name: 'ImportedType', type: 'IntrinsicType' }])
    }))

  it('should export an object type alias with imported types', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithImportedTypes'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithImportedTypes',
          children: [
            { name: 'a', type: 'WithIntrinsicTypes' },
            { name: 'b', type: 'QueryType', optional: true },
            { name: 'c', type: 'ReadonlyArrayType | LiteralType' },
          ],
        },
      ])
    }))

  it('should export an interface with imported interfaces', () =>
    withFixture(fixture, async () => {
      const markdown = await fileToMd(['WithImportedInterfaces'])

      return assertMarkdownDefinitions(markdown, [
        {
          name: 'WithImportedInterfaces',
          children: [
            { name: 'd', type: 'WithLiteralTypes', optional: true },
            { name: 'e', type: 'WithGenerics<string, number[]>' },
            { name: 'a', type: 'string[]' },
            { name: 'b', type: 'number[]' },
            { name: 'c', type: 'boolean[]' },
          ],
        },
      ])
    }))
})
