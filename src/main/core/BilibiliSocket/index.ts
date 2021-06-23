import { EventEmitter } from 'events'
import WebSocket from 'ws'
import { Logger } from '../logger'
import { bufferDecoder, textEncode, getBinary } from './bufferParser'
import { Transformer } from './Transformer'
import { transformMap } from './transforms'

export interface callback {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any[]): any
}

export interface messageOption {
  cmd: string
  data?: Record<string, unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info?: any[]
}

const BILIBILI_WS = 'wss://broadcastlv.chat.bilibili.com/sub'

export class BilibiliSocket extends EventEmitter {
  private connection!: WebSocket
  private roomId = 0
  private timer?: number
  public isConnect = false
  private logger: Logger
  private transformer: Transformer

  constructor(logger?: Logger) {
    super()
    this.logger = logger || new Logger()
    this.transformer = new Transformer()
    Object.keys(transformMap).forEach((key: string) => this.transformer.add(key, transformMap[key]))
  }

  /**
   * 创建一个新的连接
   */
  private createConnect(): void {
    const connection: WebSocket = new WebSocket(BILIBILI_WS)
    connection.binaryType = 'arraybuffer'
    this.connection = connection
  }

  /**
   * 连接到房间，监听房间信息
   * @param roomId 房间号
   */
  connect(roomId: number): void {
    this.roomId = roomId
    this.createConnect()
    this.connection.onopen = () => {
      const option = {
        uid: 0,
        roomid: this.roomId,
        protover: 2,
        platform: 'web',
        clientver: '1.5.15'
      }
      this.send(option)
      const timer = setInterval(() => this.sendHeartbeat(), 30000)
      this.timer = timer as unknown as number
      this.isConnect = true
      this.emit('open')
    }
    this.connection.onerror = (e) => {
      this.isConnect = false
      this.emit('error', e)
      this.logger.error('[BiliBiliSocket error] :', e)
    }
    this.connection.onclose = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.timer && clearInterval((this.timer as any))
      this.isConnect = false
      this.emit('close')
    }
    this.connection.onmessage = (e) => {
      this.isConnect = true
      const packs: messageOption[] = (bufferDecoder((e.data as Uint8Array)) as unknown as messageOption[])
      packs && this.emitMessage(packs)
    }
  }

  /**
   * 重新连接
   * @param roomId 房间号
   */
  reconnect(roomId?: number): void {
    roomId = roomId || this.roomId
    if (this.connected) {
      this.close()
    }
    this.connect(roomId)
  }

  /**
   * 关闭连接
   */
  close(): void {
    this.connection && this.connection.close()
    this.isConnect = false
  }

  /**
   * 发送数据包
   * @param body 数据包
   */
  send(body: unknown): void {
    const tmp = getBinary(7, textEncode(JSON.stringify(body)))
    this.connection.send(tmp)
  }

  /**
   * 监听信息
   * @param fn 回调
   */
  onMessage(fn: callback): void {
    this.on('message', fn)
  }

  onOpen(fn: callback): void {
    this.on('open', fn)
  }

  onClose(fn: callback): void {
    this.on('close', fn)
  }

  onError(fn: callback): void {
    this.on('error', fn)
  }

  /**
   * 获取连接状态
   */
  get connected(): boolean {
    return this.connection && this.isConnect
  }

  addTransformer(cmd: string, fn: callback): void {
    this.transformer.add(cmd, fn)
  }

  private emitMessage(packs: messageOption[]) {
    packs.forEach((rawData: messageOption | messageOption[]) => {
      if (Array.isArray(rawData)) {
        this.emitMessage(rawData)
      } else {
        // 对消息进行格式化
        const data = this.transformer.transform(rawData)
        // message 发送所有消息
        this.emit('message', rawData.cmd, data, rawData)
        // 发送单个消息，方便订阅特定的事件
        this.emit(rawData.cmd, data, rawData)
      }
    })
  }

  /**
   * 心跳检测
   */
  private sendHeartbeat(): void {
    const body = textEncode('[Object object]')
    this.connection.send(getBinary(2, body))
  }
}
