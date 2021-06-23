/**
 * @returns {import('vite').Plugin}
 */
module.exports = function htmlPlugin (option) {
  return {
    name: 'electron:renderer:html',
    transformIndexHtml: {
      enforce: 'pre',
      transform(html) {
        if (process.env.NODE_ENV === 'development') return html
        return {
          html,
          tags: [
            {
              tag: 'base',
              attrs: {
                href: '../../'
              },
              injectTo: 'head-prepend'
            }
          ]
        }
      }
    }
  }
}
