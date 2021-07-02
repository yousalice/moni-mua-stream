import { BilibiliSocket } from '../core/BilibiliSocket'
import { Logger } from '../core/logger'
import { Service } from './Service'

type ConnectOption = {
  roomId: number
  mid: number
  startLive?: number
}
export class MessageService extends Service {
  readonly connection: BilibiliSocket
  constructor(logger: Logger) {
    super(logger)
    this.connection = new BilibiliSocket(logger)
  }

  connect(option: ConnectOption): void {
    if (this.connection.isConnect) {
      this.connection.reconnect(option.roomId)
    } else {
      this.connection.connect(option.roomId)
    }
    this.connection.onError((e) => {
      this.log('connect error reconnect', e)
      this.connection.reconnect(option.roomId)
    })
  }

  close(): void {
    this.connection.close()
  }

  onMessage(fn: Parameters<BilibiliSocket['onMessage']>[0]): void {
    this.connection.onMessage(fn)
  }

  onClose(fn: Parameters<BilibiliSocket['onClose']>[0]): void {
    this.connection.onClose(fn)
  }

  onOpen(fn: Parameters<BilibiliSocket['onOpen']>[0]): void {
    this.connection.onOpen(fn)
  }

  onError(fn: Parameters<BilibiliSocket['onOpen']>[0]): void {
    this.connection.onError(fn)
  }
}
