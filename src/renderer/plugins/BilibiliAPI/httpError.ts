export type ErrorOption = {
  code: number | string | undefined
  status?: number | string
  stack?: string
  message: string | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: any
}
export class HttpError extends Error {
  readonly code: number | string | undefined
  readonly status: number | string | undefined
  constructor({ code, status, message, stack }: ErrorOption) {
    super(message || '')
    this.code = code
    this.status = status || this.stack
    this.stack = stack || this.stack
  }
}
