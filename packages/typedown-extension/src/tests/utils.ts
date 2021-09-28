import path from 'path'
import Mocha from 'mocha'
import { sync as glob } from 'glob'
import { commands, env, WebviewPanel, window, workspace } from 'vscode'
import sinon from 'sinon'
import { Definitions, isMessage } from 'typedown-shared'
import assert from 'assert'

import { COMMANDS } from '..'
import { escapeMarkdown, formatMarkdown } from '../markdown'

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

export async function fileToMd(exportedDefinitionNames?: string[]): Promise<string | undefined> {
  let clipboardContent: string | undefined

  sinon.replaceGetter(env, 'clipboard', () => ({
    readText() {
      return Promise.resolve('')
    },
    writeText(val: string) {
      clipboardContent = val

      return Promise.resolve()
    },
  }))

  if (exportedDefinitionNames) {
    const noop: unknown = () => undefined
    let onDidReceiveMessage: (event: unknown) => unknown
    let onDidDisposeListener: () => unknown

    sinon.stub(window, 'createWebviewPanel').callsFake(() => {
      return {
        dispose: noop,
        onDidDispose(listener: () => unknown) {
          onDidDisposeListener = listener
        },
        reveal() {
          onDidReceiveMessage({ type: 'init' })
        },
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

            onDidDisposeListener()

            return Promise.resolve(true)
          },
        },
      } as WebviewPanel
    })
  }

  await commands.executeCommand(COMMANDS.fileToMd)

  sinon.restore()

  return clipboardContent
}

export function folderToMd(): Thenable<void> {
  return commands.executeCommand(COMMANDS.folderToMd)
}

export async function assertMarkdownDefinitions(
  markdown: string | undefined,
  assertions: DefinitionAssertion[]
): Promise<void> {
  const assertionsMarkdown = assertions
    .map((assertion) => {
      const components = [`# ${assertion.name}`, assertion.description ? `${assertion.description}\n` : '']

      if (assertion.children) {
        components.push(
          '| Name | Description | Type | Optional | Default value |',
          '| --- | --- | --- | --- | --- |',
          ...assertion.children.map((child) => {
            const childComponents = [
              child.name,
              escapeMarkdown(child.description ?? ''),
              `\`${escapeMarkdown(child.type)}\``,
              child.optional === true ? '✓' : '',
              escapeMarkdown(child.defaultValue ?? ''),
            ]

            return `| ${childComponents.join(' | ')} |`
          })
        )
      } else if (assertion.type) {
        components.push(
          '| Description | Type |',
          '| --- | --- |',
          `| ${assertion.description ?? ''} | ${assertion.type} |`
        )
      }

      return components.join('\n')
    })
    .join('\n\n')

  assert.strictEqual(markdown, formatMarkdown(assertionsMarkdown))
}

interface DefinitionAssertion {
  name: string
  description?: string
  children?: {
    defaultValue?: string
    description?: string
    name: string
    optional?: boolean
    type: string
  }[]
  type?: string
}

type Run = () => Promise<void>
