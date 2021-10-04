import type { Definitions } from 'typedown-shared'
import assert from 'assert'
import { assertMarkdownDefinitions, folderToMd, getDefinitionsFromFixtures } from '../utils'

describe('root folder', () => {
  let definitions: Definitions = []

  before(async () => {
    definitions = await getDefinitionsFromFixtures('folder/src', folderToMd)
  })

  it('should export mixed types from a folder and nested folders', () => {
    assert.equal(definitions.length, 4)

    return assertMarkdownDefinitions(definitions, [
      {
        name: 'TypeAA',
        children: [
          { name: 'aa', type: 'string' },
          { name: 'ab', type: 'number', optional: true },
        ],
      },
      {
        name: 'InterfaceBA',
        children: [
          { name: 'ba', type: 'boolean' },
          { name: 'bb', type: 'string[]' },
        ],
      },
      {
        name: 'TypeCA',
        type: 'string',
      },
      {
        name: 'InterfaceDA',
        children: [
          { name: 'da', type: 'boolean', optional: true },
          { name: 'db', type: 'number[]' },
        ],
      },
    ])
  })
})
