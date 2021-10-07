import path from 'path'
import Mocha from 'mocha'
import { sync as glob } from 'glob'
import { CancellationTokenSource, commands, env, Uri, WebviewPanel, window, workspace } from 'vscode'
import sinon from 'sinon'
import { Definitions, isMessage } from 'typedown-shared'
import assert from 'assert'

import { COMMANDS, exportDefinitions } from '..'
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

export async function getDefinitionsFromFixture(
  fixtureFilePath: string,
  getDefinitions: () => Promise<Definitions>
): Promise<Definitions> {
  await commands.executeCommand('workbench.action.closeAllEditors')

  const document = await workspace.openTextDocument(getFixturesPath(fixtureFilePath))

  await window.showTextDocument(document)

  return getDefinitions()
}

export async function getDefinitionsFromFixtures(
  fixturesFolderPath: string,
  getDefinitions: (folderUri: Uri) => Promise<Definitions>
): Promise<Definitions> {
  await commands.executeCommand('workbench.action.closeAllEditors')

  return getDefinitions(Uri.file(getFixturesPath(fixturesFolderPath)))
}

export async function fileToMd(): Promise<Definitions> {
  const definitions: Definitions = []

  mockWebview(definitions)

  await commands.executeCommand(COMMANDS.fileToMd)

  sinon.restore()

  return definitions
}

export async function folderToMd(folderUri: Uri): Promise<Definitions> {
  const definitions: Definitions = []

  sinon.stub(window, 'showQuickPick').callsFake(() => {
    return Promise.resolve({ label: folderUri.fsPath, absolutePath: folderUri })
  })

  mockWebview(definitions)

  await commands.executeCommand(COMMANDS.folderToMd)

  sinon.restore()

  return definitions
}

function mockWebview(definitions: Definitions) {
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

          definitions.push(...message.definitions)

          onDidDisposeListener()

          return Promise.resolve(true)
        },
      },
    } as WebviewPanel
  })
}

function getFixturesPath(fixturesPath: string): string {
  return path.join(__dirname, '../../fixtures', fixturesPath)
}

export async function assertMarkdownDefinitions(
  definitions: Definitions,
  assertions: DefinitionAssertion[]
): Promise<void> {
  let markdown: string | undefined

  sinon.stub(window, 'showInformationMessage')

  sinon
    .stub(window, 'withProgress')
    .callsFake(
      (_options: Parameters<typeof window.withProgress>[0], task: Parameters<typeof window.withProgress>[1]) => {
        return task({ report: () => undefined }, new CancellationTokenSource().token)
      }
    )

  sinon.replaceGetter(env, 'clipboard', () => ({
    readText() {
      return Promise.resolve('')
    },
    writeText(val: string) {
      markdown = val

      return Promise.resolve()
    },
  }))

  const markdownDefinitions = assertions.reduce<Definitions>((acc, assertion) => {
    const definition = definitions.find((definition) => definition.name === assertion.name)

    if (definition) {
      acc.push(definition)
    }

    return acc
  }, [])

  await exportDefinitions(markdownDefinitions)

  sinon.restore()

  const assertionsMarkdown = assertions
    .map((assertion) => {
      const components = [
        `# ${assertion.name}`,
        assertion.description && typeof assertion.type === 'undefined' ? `${assertion.description}\n` : '',
      ]

      if (assertion.children) {
        components.push(
          '| Name | Description | Type | Optional | Default value |',
          '| --- | --- | --- | :---: | --- |',
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
          `| ${escapeMarkdown(assertion.description ?? '')} | \`${escapeMarkdown(assertion.type)}\` |`
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
