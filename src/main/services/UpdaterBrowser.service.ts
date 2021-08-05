import { Service, Inject } from './Service'
import { autoUpdater } from 'electron-updater'
import { BrowserWindow } from 'electron'
import { AdminBrowserService } from './AdminBrowser.service'
import { pages, preload, assets } from '../common/constant'
import path from 'path'
import { Logger } from '../core/logger'

export class UpdaterBrowserService extends Service {
  @Inject('AdminBrowserService')
  admin!: AdminBrowserService

  private win!: BrowserWindow | undefined

  createWindow(): void {
    if (this.win) {
      this.win.show()
      return
    }
    this.win = new BrowserWindow({
      autoHideMenuBar: true,
      show: false,
      // transparent: true,
      // frame: false,
      titleBarStyle: 'customButtonsOnHover',
      fullscreenable: false,
      resizable: false,
      minimizable: false,
      maximizable: false,
      // hasShadow: false,
      // backgroundColor: '#00FFFFFF',
      webPreferences: {
        preload: preload.init,
        contextIsolation: false,
        nodeIntegration: false
      },
      icon: assets.logo,
      width: 400,
      height: 300
    })
    this.win.loadURL(pages.update)
    this.win.on('ready-to-show', () => {
      this.win?.show()
    })
    this.win.on('close', () => {
      this.win = undefined
    })
  }

  async check(): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
      // autoUpdater.updateConfigPath = path.join(process.cwd(), 'src', 'app-update.yml')
      return
    }
    this.send('update:current-version', autoUpdater.currentVersion.version)
    try {
      const res = await autoUpdater.checkForUpdates()
      this.send('update:last-version', {
        version: res.updateInfo.version,
        date: res.updateInfo.releaseDate,
        notes: res.updateInfo.releaseNotes || ''
      })
    } catch (e) {
      this.send('update:error', {
        code: 0,
        message: '检查新版本失败，请重试'
      })
    }
  }

  download(): void {
    autoUpdater.downloadUpdate()
  }

  install(): void {
    autoUpdater.quitAndInstall()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send(channel: string, ...payload: any[]): void {
    this.win && this.win.webContents.send(channel, ...payload)
  }

  initListener(): void {
    autoUpdater.autoDownload = false
    autoUpdater.logger = new Logger()
    // 有新版本
    autoUpdater.on('update-available', () => {
      this.admin.send('update:message', { code: 1 })
      this.send('update:message', { code: 1 })
      this.log('update-available')
    })

    // 已是最新版本
    autoUpdater.on('update-not-available', () => {
      this.admin.send('update:message', { code: 2 })
      this.send('update:message', { code: 2 })
      this.log('update-not-available')
    })

    autoUpdater.on('error', () => {
      this.admin.send('update:error', {
        code: 0,
        message: '检查新版本失败，请重试'
      })
      this.log('update: error')
    })

    // 下载进度
    autoUpdater.on('download-progress', (...arg) => {
      this.send('update:downloading', ...arg)
    })

    // 下载完成
    autoUpdater.on('update-downloaded', () => {
      this.send('update:downloaded')
    })
  }
}
