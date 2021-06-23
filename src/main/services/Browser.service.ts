import { BrowserWindow } from 'electron'
import type { BrowserWindowConstructorOptions } from 'electron/main'
import { Service } from './Service'
import { assets, preload } from '../common/constant'

type BrowserOptions = Pick<BrowserWindowConstructorOptions, 'width' | 'height' | 'x' | 'y' | 'frame' | 'transparent' | 'resizable' | 'backgroundColor' | 'icon' | 'show'>
export class BrowserService extends Service {
  private browsers: Map<string | number, BrowserWindow> = new Map()
  private idSet = new Set()
  private nameSet = new Set()

  create(name: string, option: BrowserOptions = {}, url: string, show = false): BrowserWindow {
    if (this.browsers.has(name)) {
      this.warn(`browser [${name}] 已存在`)
      return this.browsers.get(name) as BrowserWindow
    }
    const win = new BrowserWindow(Object.assign({
      height: 600,
      width: 800,
      autoHideMenuBar: true,
      show: false,
      webPreferences: {
        preload: preload.init,
        contextIsolation: true,
        nodeIntegration: false
      },
      icon: assets.logo
    }, option))
    this.browsers.set(name, win)
    this.idSet.add(win.id)
    this.nameSet.add(name)
    win.loadURL(url)
    win.on('ready-to-show', () => {
      show && win.show()
    })
    return win
  }

  /**
   * 这个方法仅能在 主进程中使用，请勿在渲染进程中调用
   * @param id 窗口ID或名称
   */
  getBrowser(id: number | string): BrowserWindow | undefined {
    if (this.idSet.has(id)) {
      return (BrowserWindow.fromId((id as number)) as BrowserWindow)
    }
    if (this.browsers.has(id)) {
      return this.browsers.get(id)
    }
    this.warn(`browser [${id}] 未找到`)
    return undefined
  }

  openBrowser(id: number | string): void {
    if (!this.idSet.has(id) && !this.nameSet.has(id)) {
      this.warn(`browser [${id}] 不存在`)
      return
    }
    if (typeof id === 'string') {
      this.browsers.get(id)?.show()
    }
    if (typeof id === 'number') {
      BrowserWindow.fromId(id)?.show()
    }
  }

  closeBrowser(id: number | string): void {
    if (!this.idSet.has(id) && !this.nameSet.has(id)) {
      this.warn(`browser [${id}] 不存在`)
      return
    }
    if (typeof id === 'string') {
      this.browsers.get(id)?.close()
    }
    if (typeof id === 'number') {
      BrowserWindow.fromId(id)?.close()
    }
  }

  getBrowserId(name: string): number | undefined {
    if (this.browsers.has(name)) {
      return this.browsers.get(name)?.id
    }
    return undefined
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send(id: number | string, handleName: string, ...payloads: any[]): void {
    const win = this.getBrowser(id)
    win && win.webContents.send(handleName, ...payloads)
  }
}
