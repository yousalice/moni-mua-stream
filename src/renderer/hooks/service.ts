import { useIpc } from './electron'
import type { Services } from '/@main/services'

const { invoke } = useIpc()

function createProxy(service: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Proxy({} as any, {
    get(_, functionName) {
      return (...payloads: unknown[]) => {
        return invoke('service:call', service, functionName as string, ...payloads)
      }
    }
  })
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const servicesProxy: Services = new Proxy({} as any, {
  get(_, serviceName) { return createProxy(serviceName as string) }
})

export function useService<T extends keyof Services>(name: T): Services[T] {
  return servicesProxy[name]
}
