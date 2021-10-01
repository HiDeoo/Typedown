import type { Definitions } from 'typedown-shared'
import { assertMarkdownDefinitions, fileToMd, getDefinitionsFromFixture } from '../utils'

describe('imports', () => {
  let definitions: Definitions = []

  before(async () => {
    definitions = await getDefinitionsFromFixture('file/src/imports.ts', fileToMd)
  })

  it('should export a type alias of imported type', () =>
    assertMarkdownDefinitions(definitions, [{ name: 'ImportedType', type: 'IntrinsicType' }]))

  it('should export an object type alias with imported types', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithImportedTypes',
        children: [
          { name: 'a', type: 'WithIntrinsicTypes' },
          { name: 'b', type: 'QueryType', optional: true },
          { name: 'c', type: 'ReadonlyArrayType | LiteralType' },
        ],
      },
    ]))

  it('should export an interface with imported interfaces', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithImportedInterfaces',
        children: [
          { name: 'd', type: 'WithLiteralTypes', optional: true },
          { name: 'e', type: 'WithGenerics<string, number[]>' },
          { name: 'f', type: "'Hello test'" },
          { name: 'a', type: 'string[]' },
          { name: 'b', type: 'number[]' },
          { name: 'c', type: 'boolean[]' },
        ],
      },
    ]))
})
