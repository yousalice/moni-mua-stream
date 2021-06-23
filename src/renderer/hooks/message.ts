import { onUnmounted } from 'vue'
import { useIpc } from './electron'
import { LiveCmd } from '/@shared/liveCmd'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const ipc = useIpc()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type callback<T> = (data: T, rawData: any) => void

interface CallbackMap {
  message: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (cmd: string, data:any, rawData: any): void
  }
  operation: callback<OperationOption>
  danMuMsg: callback<DanMuMsgOption>
  sendGift: callback<SendGiftOption>
  superChartMsg: callback<SuperChatMessageOption>
  interact: callback<InteractOption>
  entryEffect: callback<EntryEffectOption>
  guardBuy: callback<GuardBuyOption>
  liveStart: callback<LiveOrPreparingOption>
  liveEnd: callback<LiveOrPreparingOption>
  cuteOff: callback<CuteOffOption>
  open: {
    (): void
  }
  close: {
    (): void
  }
  error: {
    (error: Error): void
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useMessage() {
  const callbackMap: CallbackMap = {
    message: noop,
    danMuMsg: noop,
    sendGift: noop,
    superChartMsg: noop,
    interact: noop,
    entryEffect: noop,
    guardBuy: noop,
    liveStart: noop,
    liveEnd: noop,
    operation: noop,
    cuteOff: noop,
    open: noop,
    close: noop,
    error: noop
  }

  const _onMessage = <T extends keyof CallbackMap>(key: T) => {
    return (fn: CallbackMap[T]) => {
      callbackMap[key] = fn || noop
    }
  }
  const onMessage = _onMessage('message')
  const onDanMuMsg = _onMessage('danMuMsg')
  const onSendGift = _onMessage('sendGift')
  const onSuperChart = _onMessage('superChartMsg')
  const onInteractWord = _onMessage('interact')
  const onEntryEffect = _onMessage('entryEffect')
  const onGuardBuy = _onMessage('guardBuy')
  const onLiveStart = _onMessage('liveStart')
  const onLiveEnd = _onMessage('liveEnd')
  const onOperation = _onMessage('operation')
  const onCuteOff = _onMessage('cuteOff')
  const onOpen = _onMessage('open')
  const onClose = _onMessage('close')
  const onError = _onMessage('error')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function messageListener(_event: unknown, cmd: string, data: any, rawData: any) {
    callbackMap.message(cmd, data, rawData)
    switch (cmd) {
      case LiveCmd.DANMU_MSG:
        callbackMap.danMuMsg(data as DanMuMsgOption, rawData)
        break
      case LiveCmd.SEND_GIFT:
        callbackMap.sendGift(data as SendGiftOption, rawData)
        break
      case LiveCmd.SUPER_CHAT_MESSAGE:
      case LiveCmd.SUPER_CHAT_MESSAGE_JP:
        callbackMap.superChartMsg(data as SuperChatMessageOption, rawData)
        break
      case LiveCmd.INTERACT_WORD:
        callbackMap.interact(data as InteractOption, rawData)
        break
      case LiveCmd.ENTRY_EFFECT:
        callbackMap.entryEffect(data as EntryEffectOption, rawData)
        break
      case LiveCmd.GUARD_BUY:
        callbackMap.guardBuy(data as GuardBuyOption, rawData)
        break
      case LiveCmd.LIVE:
        callbackMap.liveStart(data as LiveOrPreparingOption, rawData)
        break
      case LiveCmd.PREPARING:
        callbackMap.liveEnd(data as LiveOrPreparingOption, rawData)
        break
      case LiveCmd.OPERATION:
        callbackMap.operation(data as OperationOption, rawData)
        break
      case LiveCmd.CUT_OFF:
        callbackMap.cuteOff(data as CuteOffOption, rawData)
        break
    }
  }

  function closeListener() {
    callbackMap.close()
  }

  function openListener() {
    callbackMap.open()
  }

  function errorListener(_event: unknown, err: Error) {
    callbackMap.error(err)
  }

  const channel = {
    open: 'socket:open',
    close: 'socket:close',
    error: 'socket:error',
    message: 'socket:message'
  }

  ipc.on(channel.message, messageListener)
  ipc.on(channel.open, openListener)
  ipc.on(channel.close, closeListener)
  ipc.on(channel.error, errorListener)

  const destroyMessage = () => {
    ipc.removeListener(channel.message, messageListener)
    ipc.removeListener(channel.open, openListener)
    ipc.removeListener(channel.close, closeListener)
    ipc.removeListener(channel.error, errorListener)
  }

  onUnmounted(() => destroyMessage())

  return {
    onMessage,
    onDanMuMsg,
    onSendGift,
    onSuperChart,
    onInteractWord,
    onEntryEffect,
    onGuardBuy,
    onLiveEnd,
    onLiveStart,
    onOperation,
    onCuteOff,
    onOpen,
    onClose,
    onError,
    destroyMessage
  }
}
