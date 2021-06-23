
export interface callback {
  (...arg: unknown[]): void
}

export class SimpleEvent {
  private handlers: Record<string, callback[]> = {}

  on(handleName: string, cb: callback): number {
    if (!this.handlers[handleName]) {
      this.handlers[handleName] = []
    }
    this.handlers[handleName].push(cb)
    return this.handlers[handleName].length - 1
  }

  off(handleName: string, handle: number): void {
    if (!this.handlers[handleName]) return
    this.handlers[handleName].splice(handle, 1)
  }

  emit(handleName: string, ...arg: unknown[]): void {
    if (!this.handlers[handleName]) return
    // eslint-disable-next-line node/no-callback-literal
    this.handlers[handleName].forEach((cb: callback) => cb(...arg))
  }
}
