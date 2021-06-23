import { ref } from 'vue'

const isMonitor = ref(false)

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function usePlay() {
  return {
    isMonitor
  }
}
