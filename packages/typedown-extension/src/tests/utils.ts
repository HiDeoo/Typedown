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

export async function withFixture(fixture: string, fileNameOrRun: string | Run, run?: Run): Promise<void> {
  await commands.executeCommand('workbench.action.closeAllEditors')

  const withFileName = typeof fileNameOrRun === 'string'

  if (withFileName) {
    const document = await workspace.openTextDocument(path.join(__dirname, '../../fixtures', fixture, fileNameOrRun))

    await window.showTextDocument(document)
  }

  if (withFileName) {
    if (!run) {
      throw new Error(`Missing test run for fixture '${fixture}' and fileName '${fileNameOrRun}'.`)
    }

    await run()
  } else {
    await fileNameOrRun()
  }

  return commands.executeCommand('workbench.action.closeAllEditors')
}

export function fileToMd(): Thenable<void> {
  return commands.executeCommand(COMMANDS.fileToMd)
}

export function folderToMd(): Thenable<void> {
  return commands.executeCommand(COMMANDS.folderToMd)
}

type Run = () => Promise<void>
