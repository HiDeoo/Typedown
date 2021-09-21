import { assertClipboardDefinitions, fileToMd, withFixture } from '../utils'

describe('interfaces', () => {
  it('should export an interface of intrinsic types', async () =>
    withFixture('file/src/interfaces.ts', async () => {
      await fileToMd(['WithIntrinsicTypes'])

      return assertClipboardDefinitions([
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
