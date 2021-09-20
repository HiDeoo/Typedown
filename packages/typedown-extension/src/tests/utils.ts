import path from 'path'
import Mocha from 'mocha'
import { sync as glob } from 'glob'
import { commands, window, workspace } from 'vscode'

import { COMMANDS } from '..'

export function runSuite(testsRoot: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const mocha = new Mocha({
      ui: 'bdd',
      color: true,
    })

    const testFiles = glob('**.test.js', { cwd: testsRoot })

    testFiles.forEach((testFile) => mocha.addFile(path.resolve(testsRoot, testFile)))

    try {
      mocha.run((failures) => {
        if (failures > 0) {
          reject(new Error(`${failures} tests failed.`))
        } else {
          resolve()
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}

export async function withFixture(fixtureFilePath: string, run: Run): Promise<void> {
  await commands.executeCommand('workbench.action.closeAllEditors')

  const document = await workspace.openTextDocument(path.join(__dirname, '../../fixtures', fixtureFilePath))

  await window.showTextDocument(document)

  await run()

  return commands.executeCommand('workbench.action.closeAllEditors')
}

export function fileToMd(): Thenable<void> {
  return commands.executeCommand(COMMANDS.fileToMd)
}

export function folderToMd(): Thenable<void> {
  return commands.executeCommand(COMMANDS.folderToMd)
}

type Run = () => Promise<void>
