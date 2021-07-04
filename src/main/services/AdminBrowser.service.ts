import { MessageService } from './Message.service'
import { Service, Inject } from './Service'
import { AppConfigOption, getConfig } from '../core/appConfig'
import { pages, preload, assets } from '../common/constant'
import { BrowserWindow } from 'electron'

export class AdminBrowserService extends Service {
  @Inject('MessageService')
  messageService!: MessageService

  private win!: BrowserWindow

  private messageWhiteList: string[] = ['all']

  private get config(): AppConfigOption {
    return getConfig()
  }

  create(): void {
    this.win = new BrowserWindow({
      autoHideMenuBar: true,
      show: false,
      transparent: true,
      frame: false,
      // titleBarStyle: 'customButtonsOnHover',
      // hasShadow: false,
      backgroundColor: '#00FFFFFF',
      webPreferences: {
        preload: preload.init,
        contextIsolation: false,
        nodeIntegration: false
      },
      icon: assets.logo,
      width: 1600,
      height: 900
    })
    this.win.loadURL(pages.admin)
    this.win.on('ready-to-show', () => {
      this.win.show()
    })
    this.addListeners()
  }

  connect(option: Parameters<MessageService['connect']>[0] & { whiteList?: string[] }): void {
    this.messageWhiteList = option.whiteList || ['all']
    this.emit('connect-start', option)
    this.messageService.connect(option)
  }

  close(): void {
    this.win.close()
  }

  addListeners(): void {
    this.messageService.onOpen(() => {
      this.send('socket:open')
    })

    this.messageService.onClose(() => {
      this.send('socket:close')
    })

    this.messageService.onError((error) => {
      this.send('socket:error', error?.message)
    })

    this.messageService.onMessage((cmd: string, ...payload) => {
      if (this.messageWhiteList.length === 0) return
      if (
        (this.messageWhiteList.length === 1 && this.messageWhiteList[0] === 'all') ||
        this.messageWhiteList.includes(cmd)
      ) {
        this.send('socket:message', cmd, ...payload)
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send(channel: string, ...payload: any[]): void {
    this.win.webContents.send(channel, ...payload)
  }
}
