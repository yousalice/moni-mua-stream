const { join, resolve } = require('path')
const { external } = require('../package.json')
const { default: vue } = require('@vitejs/plugin-vue')
const htmlPlugin = require('./plugins/rollup.html.plugin')
const { readdirSync } = require('fs')

// console.log(readdirSync(join(__dirname, '../src/renderer/pages')))

const entries = readdirSync(join(__dirname, '../src/renderer/pages'))
  // .filter(f => f.endsWith('.html'))
  .map(f => join(__dirname, '../src/renderer/pages', f, 'index.html'))

/**
 * Vite shared config, assign alias and root dir
 * @type {import('vite').UserConfig}
 */
const config = {
  root: join(__dirname, '../src/renderer'),
  base: '', // has to set to empty string so the html assets path will be relative
  build: {
    rollupOptions: {
      input: entries
    },
    outDir: resolve(__dirname, '../dist/renderer'),
    assetsInlineLimit: 0
  },
  resolve: {
    alias: {
      '/@shared': join(__dirname, '../src/shared'),
      '/@': join(__dirname, '../src/renderer')
    }
  },
  define: {
    __IS_MONI__: true
  },
  optimizeDeps: {
    exclude: external
  },
  // @ts-ignore
  plugins: [vue(), htmlPlugin()]
}

module.exports = config
