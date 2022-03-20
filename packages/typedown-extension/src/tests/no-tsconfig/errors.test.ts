import assert from 'assert'
import sinon from 'sinon'
import { Uri, window } from 'vscode'

import { fileToMd, folderToMd, getDefinitionsFromFixture } from '../utils'

let windowShowErrorMessageStub: sinon.SinonStub<Parameters<typeof window.showErrorMessage>>

function assertNoTSConfigErrors() {
  assert(
    windowShowErrorMessageStub.calledOnceWith('Could not find a TSConfig file for your workspace.', {
      detail: undefined,
      modal: true,
    })
  )
}

describe('no ts-config', () => {
  beforeEach(() => {
    windowShowErrorMessageStub = sinon.stub(window, 'showErrorMessage')
  })

  afterEach(() => {
    windowShowErrorMessageStub.restore()
  })

  it('should error for a file in a workspace without a TSConfig resolved', async () => {
    await getDefinitionsFromFixture('no-tsconfig/src/index.ts', fileToMd)

    assertNoTSConfigErrors()
  })

  it('should error for a folder in a workspace without a TSConfig resolved', async () => {
    await folderToMd(Uri.file(__dirname))

    assertNoTSConfigErrors()
  })
})
