import type Electron from 'electron'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { shell, clipboard, dialog, ipcRenderer } = (window as any).electron as typeof Electron

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useShell() {
  return shell
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useClipboard() {
  return clipboard
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useIpc() {
  return ipcRenderer
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useDialog() {
  return dialog
}
