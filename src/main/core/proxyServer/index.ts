import http from 'http'
import connect from 'connect'
import httpProxy from 'http-proxy'
import cors from 'cors'
import bodyParser from 'body-parser'
import portFinder from 'portfinder'
import { ConfigOption, proxyConfig } from './config'

let app!: connect.Server
let server!: http.Server

export async function createProxyServer(): Promise<{ app: http.Server, url: string }> {
  const proxy = httpProxy.createProxyServer()
  app = connect()

  app.use(cors())

  app.use(bodyParser.urlencoded({ extended: false }))

  app.use(function (req, res) {
    const url = req.url as string
    let uri!: string
    proxyConfig.forEach((config: ConfigOption) => {
      if (url.startsWith(config.match)) {
        uri = config.url
        req.url = url.replace(config.match, '')
      }
    })

    proxy.on('error', (_err, _req, res) => {
      res.statusCode = 500
      res.end()
    })

    proxy.web(req, res, {
      target: uri,
      changeOrigin: true,
      headers: {
        referer: uri
      }
    })
  })

  server = http.createServer(app)

  const port = await portFinder.getPortPromise()
  app.listen(port)
  return { app: server, url: 'http://127.0.0.1:' + port }
}

export function closeProxyServer(): void {
  server && server.close()
}
