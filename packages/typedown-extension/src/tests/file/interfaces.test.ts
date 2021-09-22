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
})
