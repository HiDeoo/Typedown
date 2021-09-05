import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  root: 'src/webview',
  plugins: [svelte({ configFile: '../../svelte.config.js' })],
  build: {
    outDir: '../../dist/webview',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames: 'assets/[name].js',
        entryFileNames: 'assets/[name].js',
        manualChunks: {},
      },
    },
  },
})
