import { ref } from 'vue'

export type logItemOption = {
  name: string
  weight: number
  random: number
  aRes: number
  pick?: boolean
}

const logList = ref<(logItemOption | string)[]>([])

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useLogger() {
  function addLogger(item: logItemOption | string) {
    logList.value.push(item)
  }
  function resetLogger() {
    logList.value = []
  }
  return {
    logList,
    addLogger,
    resetLogger
  }
}
