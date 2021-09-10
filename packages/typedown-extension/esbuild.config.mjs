import esbuild from 'esbuild'

esbuild.buildSync({
  bundle: true,
  entryPoints: ['./src'],
  external: ['vscode', 'typescript', 'typedoc-default-themes', 'onigasm'],
  format: 'cjs',
  outfile: '../../dist/index.js',
  platform: 'node',
  sourcemap: true,
})
