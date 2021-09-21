import path from 'path'
import Mocha from 'mocha'
import { sync as glob } from 'glob'
import { commands, env, WebviewPanel, window, workspace } from 'vscode'
import sinon from 'sinon'
import { Definitions, isMessage } from 'typedown-shared'
import assert from 'assert'

import { COMMANDS } from '..'

export function runSuite(testsRoot: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const mocha = new Mocha({
      ui: 'bdd',
      color: true,
      timeout: 20000,
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

export async function fileToMd(exportedDefinitionNames?: string[]): Promise<void> {
  let windowWreateWebviewPanelStub: sinon.SinonStub<Parameters<typeof window.createWebviewPanel>> | undefined

  if (exportedDefinitionNames) {
    const noop: unknown = () => undefined
    let onDidReceiveMessage: (event: unknown) => unknown

    windowWreateWebviewPanelStub = sinon.stub(window, 'createWebviewPanel').callsFake(() => {
      return {
        dispose: noop,
        onDidDispose: noop,
        reveal: noop,
        visible: false,
        webview: {
          asWebviewUri: noop,
          onDidReceiveMessage(listener: (event: unknown) => unknown) {
            onDidReceiveMessage = listener
          },
          postMessage(message: unknown): Thenable<boolean> {
            if (!isMessage(message) || message.type !== 'import') {
              return Promise.reject()
            }

            const definitions = exportedDefinitionNames.reduce<Definitions>((acc, definitionName) => {
              const definition = message.definitions.find((definition) => definition.name === definitionName)

              if (definition) {
                acc.push(definition)
              }

              return acc
            }, [])

            onDidReceiveMessage({ type: 'export', definitions })

            if (windowWreateWebviewPanelStub) {
              windowWreateWebviewPanelStub.restore()
            }

            return Promise.resolve(true)
          },
        },
      } as WebviewPanel
    })
  }

  return commands.executeCommand(COMMANDS.fileToMd)
}

export function folderToMd(): Thenable<void> {
  return commands.executeCommand(COMMANDS.folderToMd)
}

export async function assertClipboardDefinitions(assertions: DefinitionAssertion[]): Promise<void> {
  const markdown = assertions
    .map((assertion) => {
      return `# ${assertion.name}

| Name | Type |
| --- | --- |
${assertion.children.map((child) => `| ${child.name} | \`${child.type}\` |`).join('\n')}`
    })
    .join('\n\n')

  const clipboard = await env.clipboard.readText()

  assert.strictEqual(clipboard, markdown)
}

interface DefinitionAssertion {
  name: string
  children: {
    name: string
    type: string
  }[]
}

type Run = () => Promise<void>
