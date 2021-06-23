import path from 'path'

/**
 * @returns {import('rollup').Plugin}
 */
export default function createVueDevtoolsPlugin() {
  return {
    name: 'electron:devtools',
    async resolveId(id) {
      if (id === 'vue-devtools') {
        return id
      }
    },
    async load(id) {
      if (id === 'vue-devtools') {
        const url = path.resolve(__dirname, '../extensions').replace(/\\/g, '/')
        return `export default '${url}'`
      }
    }
  }
}
