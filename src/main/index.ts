import { app } from 'electron'
import './ipc/dialog'
import { Logger } from './core/logger'
import { initService } from './services'
// import createBaseWorker from './workers/index?worker'
import { createProxyServer } from './core/proxyServer'
import { bootstrap } from './bootstrap'

async function main() {
  const logger = new Logger()
  logger.initialize(app.getPath('userData'))

  initService(logger)

  const { url } = await createProxyServer()
  process.env.BILIBILI_HTTP_PROXY = url

  await app.whenReady()

  await bootstrap()

  // thread_worker example
  // createBaseWorker({ workerData: 'worker world' }).on('message', (message) => {
  //   logger.log(`Message from worker: ${message}`)
  // }).postMessage('')
}

// ensure app start as single instance
if (!app.requestSingleInstanceLock()) {
  app.quit()
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

process.nextTick(main)
