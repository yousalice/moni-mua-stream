import type { callback, messageOption } from './index'
export class Transformer {
  private transformers: Record<string, callback> = {}

  add(cmd: string, fn: callback): void {
    this.transformers[cmd] = fn
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(message: messageOption): any {
    const { cmd } = message
    const transform = this.transformers[cmd]
    return transform ? transform(message) : message
  }
}
