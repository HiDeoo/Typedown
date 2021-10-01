import type { Definitions } from 'typedown-shared'
import { assertMarkdownDefinitions, fileToMd, getDefinitionsFromFixture } from '../utils'

describe.only('mixed', () => {
  let definitions: Definitions = []

  before(async () => {
    definitions = await getDefinitionsFromFixture('file/src/mixed.ts', fileToMd)
  })

  it('should export a type alias of interface union type', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'InterfaceIntersectionType',
        type: 'TestInterfaceA & TestInterfaceB',
      },
    ]))

  it('should export an object type alias with interface types', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithInterfaceTypes',
        children: [
          { name: 'a', type: 'TestInterfaceA' },
          { name: 'b', type: 'TestInterfaceB', optional: true },
        ],
      },
    ]))

  it('should export an interface with type alias types', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'WithTypesInterfaces',
        children: [
          { name: 'a', type: "'test'" },
          { name: 'b', type: 'TestTypeB', optional: true },
        ],
      },
    ]))

  it('should export multiple mixed types', () =>
    assertMarkdownDefinitions(definitions, [
      {
        name: 'InterfaceIntersectionType',
        type: 'TestInterfaceA & TestInterfaceB',
      },
      {
        name: 'WithInterfaceTypes',
        children: [
          { name: 'a', type: 'TestInterfaceA' },
          { name: 'b', type: 'TestInterfaceB', optional: true },
        ],
      },
      {
        name: 'WithTypesInterfaces',
        children: [
          { name: 'a', type: "'test'" },
          { name: 'b', type: 'TestTypeB', optional: true },
        ],
      },
    ]))
})
