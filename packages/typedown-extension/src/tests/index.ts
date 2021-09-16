import fs from 'fs'
import path from 'path'
import { runTests } from '@vscode/test-electron'
import { sync as glob } from 'glob'

async function runTestsWithFixtures(extensionDevelopmentPath: string, launchArgs: string[], suite: string) {
  const extensionTestsPath = path.resolve(__dirname, suite)
  const fixtureTestsPath = path.join(extensionTestsPath, '../../../fixtures', suite)

  if (!fs.existsSync(fixtureTestsPath)) {
    throw new Error(`Could not find fixtures for test suite '${suite}'.`)
  }

  try {
    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [fixtureTestsPath, ...launchArgs],
    })
  } catch (error) {
    console.error(`Failed to run tests with fixtures for suite '${suite}': ${error}.`)
    throw error
  }
}

async function main() {
  try {
    const suites = glob('**/', { cwd: __dirname })

    const launchArgs = ['--disable-extensions']
    const extensionDevelopmentPath = path.resolve(__dirname, '../..')

    for (const suite of suites) {
      await runTestsWithFixtures(extensionDevelopmentPath, launchArgs, suite)
    }
  } catch (error) {
    console.error(`Failed to run tests: ${error}.`)
    process.exit(1)
  }
}

main()
