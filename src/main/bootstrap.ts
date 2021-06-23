import { userService } from './services'

export async function bootstrap(): Promise<void> {
  const dataBaseService = userService('DataBaseService')
  dataBaseService.bootstrap()
  const adminBrowserService = userService('AdminBrowserService')
  adminBrowserService.create()
}
