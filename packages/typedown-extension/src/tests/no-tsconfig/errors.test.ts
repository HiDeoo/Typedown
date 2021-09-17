import assert from 'assert'
import sinon from 'sinon'
import { commands, window } from 'vscode'

import { folderToMd, withFixture } from '../utils'

let consoleErrorStub: sinon.SinonStub<Parameters<typeof console.error>>
let windowShowErrorMessageStub: sinon.SinonStub<Parameters<typeof window.showErrorMessage>>

function assertNoTSConfigErrors() {
  const errorStr = 'Could not find a TSConfig file for your workspace.'

  assert(consoleErrorStub.calledOnce)

  const error = consoleErrorStub.args[0]?.[0]

  if (!error || !(error instanceof Error)) {
    throw new Error(`console.error() expected to be called with an error but called instead with: ${typeof error}.`)
  }

  assert.equal(errorStr, error.message)

  assert(windowShowErrorMessageStub.calledOnceWith(errorStr, { detail: undefined, modal: true }))
}

describe('no ts-config', () => {
  beforeEach(() => {
    consoleErrorStub = sinon.stub(console, 'error')
    windowShowErrorMessageStub = sinon.stub(window, 'showErrorMessage')
  })

  afterEach(() => {
    consoleErrorStub.restore()
    windowShowErrorMessageStub.restore()
  })

  it('should error for a file in a workspace without a TSConfig resolved', async () =>
    withFixture('no-tsconfig', async () => {
      await await commands.executeCommand('typedown.fileToMd')

      assertNoTSConfigErrors()
    }))

  it('should error for a folder in a workspace without a TSConfig resolved', async () =>
    withFixture('no-tsconfig', async () => {
      await folderToMd()

      assertNoTSConfigErrors()
    }))
})
