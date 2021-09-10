import esbuild from 'esbuild'

const args = process.argv.slice(2)
const dev = args.includes('--dev')

esbuild.buildSync({
  bundle: true,
  entryPoints: ['./src'],
  external: ['vscode', 'typescript', 'typedoc-default-themes', 'onigasm'],
  format: 'cjs',
  minify: !dev,
  outfile: '../../dist/index.js',
  platform: 'node',
  sourcemap: true,
})
