import type { Definitions } from 'typedown-shared'
import { assertMarkdownDefinitions, fileToMd, getDefinitionsFromFixture } from '../utils'

describe('headings', () => {
  let definitions: Definitions = []

  before(async () => {
    definitions = await getDefinitionsFromFixture('file/src/headings.ts', fileToMd)
  })

  it('should export definitions with various heading levels', async () => {
    for (let headingLevel = 1; headingLevel <= 6; headingLevel++) {
      await assertMarkdownDefinitions(
        definitions,
        [
          {
            name: 'HeadingInterface',
            children: [
              { name: 'a', type: 'string' },
              { name: 'b', type: 'number' },
            ],
          },
        ],
        headingLevel
      )
    }
  })
})
