declare type SenderOption = {
  uid: number
  name: string
  face?: string
  faceFrame?: string
  guardLevel?: number
  guardName?: string
  isAdmin?: boolean
}

declare type MedalOption = {
  level: number | string
  name: string
  guardLevel: number
  guardName?: string
  owner?: number | string | boolean
  roomId?: number
  color?: string
  borderColor?: string
  colorStart?: string
  colorEnd?: string
}

declare type GiftOption = {
  id: number
  name: string
  type?: number
  price?: number
  num?: number
}

declare type BlindGift = {
  configId: number
  action: string
  originalGiftId: number
  originalGiftName: string
}

declare type DanMuMsgOption = {
  sender: SenderOption
  medal: MedalOption
  timestamp: number
  comment: string
}

declare type OperationOption = {
  count: number
}

declare type SendGiftOption = {
  sender: SenderOption
  medal: MedalOption
  gift: GiftOption
  blindGift?: BlindGift
  action: string
  giftCount: number
  superGiftCount: number
  timestamp: number
  remain: string
  coinType: number
  totalCoin: number
  effectBlock: string
}

declare type InteractOption = {
  medal?: MedalOption
  uid: number
  name: string
  type: number
  timestamp: number
  triggerTime: number
}

// declare type WelcomeOption = {
//   uid: number
//   name: string
//   face: string
//   isAdmin: boolean
// }

// declare type WelcomeGuardOption = {
//   uid: number
//   name: string
//   face: string
//   guardLevel: number | string
//   guardName: string
// }

declare type EntryEffectOption = {
  uid: number
  name: string
  face: string
  guardLevel: number | string
  guardName: string
}

declare type GuardBuyOption = {
  uid: number
  name: string
  guardLevel: number | string
  guardName: string
  guardCount: number
}

declare type SuperChatMessageOption = {
  id: number
  message: string
  messageJpn?: string
  price: number
  startTime: number
  endTime: number
  time: number
  sender: SenderOption
  medal: MedalOption
  gift: GiftOption
}

// declare type GiftTopItemOption = {
//   uid: number
//   name: string
//   coin: number | string
// }

declare type LiveOrPreparingOption = {
  roomId: number
}

declare type CuteOffOption = {
  msg: string
}
