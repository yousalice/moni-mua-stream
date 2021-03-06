import { existsSync } from 'fs'
import { join, relative } from 'path'
import { cleanUrl } from './util'

/**
 * @returns {import('rollup').Plugin}
 */
export default function createPreloadPlugin() {
  return {
    name: 'electron:renderer',

    resolveId(source) {
      if (source.startsWith('/@renderer') && source.endsWith('.html')) {
        const target = source.replace('/@renderer', join(__dirname, '../src/renderer'))
        if (existsSync(target)) {
          return target + '?renderer'
        }
      }
    },
    async load(id) {
      if (id.endsWith('?renderer')) {
        // const clean = cleanUrl(id)
        // console.log('clean', clean)
        const clean = relative(join(__dirname, '../src/renderer'), cleanUrl(id))
        if (this.meta.watchMode) {
          // devmode return dev server url
          const url = JSON.stringify(`http://localhost:8080/${clean}`)
          return `export default ${url};`
        } else {
          return `import { join } from 'path'; import { pathToFileURL } from 'url'; export default pathToFileURL(join(__dirname, 'renderer', ${JSON.stringify(clean)})).toString();`
        }
      }
    }
  }
}
