import glob from 'glob'
import Mocha from 'mocha'
import path from 'path'

export function run(): Promise<void> {
  return new Promise((resolve, reject) => {
    const mocha = new Mocha({
      ui: 'bdd',
      color: true,
    })

    const testsRoot = path.resolve(__dirname, '..')

    glob('**/**.test.js', { cwd: testsRoot }, (globError, files) => {
      if (globError) {
        return reject(globError)
      }

      files.forEach((file) => mocha.addFile(path.resolve(testsRoot, file)))

      try {
        mocha.run((failures) => {
          if (failures > 0) {
            reject(new Error(`${failures} tests failed.`))
          } else {
            resolve()
          }
        })
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  })
}
