import fs from 'fs'
import path from 'path'
import { runTests } from '@vscode/test-electron'
import Mocha from 'mocha'
import { sync as glob } from 'glob'

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

function runTestsWithFixtures(extensionDevelopmentPath: string, launchArgs: string[], suite: string) {
  const extensionTestsPath = path.resolve(__dirname, suite)
  const fixtureTestsPath = path.join(extensionTestsPath, '../../../fixtures', suite)

  if (!fs.existsSync(fixtureTestsPath)) {
    throw new Error(`Cound not find fixtures for test suite '${suite}'.`)
  }

  return runTests({
    extensionDevelopmentPath,
    extensionTestsPath,
    launchArgs: [fixtureTestsPath, ...launchArgs],
  })
}

async function main() {
  try {
    const suites = glob('**/', { cwd: __dirname })

    const launchArgs = ['--disable-extensions']
    const extensionDevelopmentPath = path.resolve(__dirname, '../..')

    for (const suite of suites) {
      await runTestsWithFixtures(extensionDevelopmentPath, launchArgs, suite)
    }
  } catch (err) {
    console.error('Failed to run tests.')
    process.exit(1)
  }
}

main()
