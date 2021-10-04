import type { Definitions } from 'typedown-shared'
import assert from 'assert'
import { assertMarkdownDefinitions, folderToMd, getDefinitionsFromFixtures } from '../utils'

describe('nested folder', () => {
  let definitions: Definitions = []

  before(async () => {
    definitions = await getDefinitionsFromFixtures('folder/src/nested', folderToMd)
  })

  it('should export mixed types from a nested folder', () => {
    assert.equal(definitions.length, 2)

    return assertMarkdownDefinitions(definitions, [
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
