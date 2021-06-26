import { userService } from './services'
import { MessageService } from './services/Message.service'

export async function bootstrap(): Promise<void> {
  const dataBaseService = userService('DataBaseService')
  dataBaseService.bootstrap()
  const adminBrowserService = userService('AdminBrowserService')
  adminBrowserService.create()
  adminBrowserService.on('connect-start', ({ mid }: Parameters<MessageService['connect']>[0]) => {
    // 之前版本 moni 的数据存在 basic 别名中， 继续保留， 其他人已 mid作为 prefix
    dataBaseService.setBasic(mid === 1589117610 ? 'basic' : mid + '')
  })
}
