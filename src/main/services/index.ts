import { ipcMain } from 'electron'
import { Logger } from '../core/logger'
import { INJECTIONS_SYMBOL } from './Service'
// import { BrowserService } from './Browser.service'
import { MessageService } from './Message.service'
import { DataBaseService } from './Data.service'
import { AdminBrowserService } from './AdminBrowser.service'
import { UpdaterBrowserService } from './UpdaterBrowser.service'

/**
 * All services definition
 */
export interface Services {
  DataBaseService: DataBaseService,
  AdminBrowserService: AdminBrowserService,
  UpdaterBrowserService: UpdaterBrowserService,
  MessageService: MessageService
}

let _services: Services

/**
 * Initialize the services module to serve client (renderer process)
 *
 * @param logger The simple app logger
 */
export function initService(logger: Logger): void {
  _initialize({
    DataBaseService: new DataBaseService(logger),
    AdminBrowserService: new AdminBrowserService(logger),
    UpdaterBrowserService: new UpdaterBrowserService(logger),
    MessageService: new MessageService(logger)
  })
}

export function userService<K extends keyof Services>(service: K): Services[K] {
  return (_services as Services)[service]
}

/**
 * Initialize the services module to serve client (renderer process)
 *
 * @param services The running services for current app
 */
function _initialize(services: Services): void {
  if (_services) {
    throw new Error('Should not initialize the services multiple time!')
  }
  _services = services
  for (const serv of Object.values(services)) {
    const injects = Object.getPrototypeOf(serv)[INJECTIONS_SYMBOL] || []
    for (const i of injects) {
      const { type, field }: { type: keyof Services, field: string } = i
      if (type in services) {
        const success = Reflect.set(serv, field, services[type])
        if (!success) {
          throw new Error(`Cannot set service ${type} to ${Object.getPrototypeOf(serv)}`)
        }
      } else {
        throw new Error(`Cannot find service named ${type}! Which is required by ${Object.getPrototypeOf(serv).constructor.name}`)
      }
    }
  }
}

export class ServiceNotFoundError extends Error {
  constructor(readonly service: string) {
    super(`Cannot find service named ${service}!`)
  }
}
export class ServiceMethodNotFoundError extends Error {
  constructor(readonly service: string, readonly method: string) {
    super(`Cannot find method named ${method} in service [${service}]!`)
  }
}

ipcMain.handle(
  'service:call',
  (_event, name: string, method: string, ...payloads: unknown[]) => {
    if (!_services) {
      throw new Error('Cannot call any service until the services are ready!')
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const service = (_services as any)[name]
    if (!service) {
      throw new ServiceNotFoundError(name)
    }
    if (!service[method]) {
      throw new ServiceMethodNotFoundError(name, (method as string))
    }
    return service[method](...payloads)
  }
)
