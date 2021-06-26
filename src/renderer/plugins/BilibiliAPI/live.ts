import { liveHttp, ResponseData } from './http'
import { HttpError } from './httpError'
import { objKeyToUpperCase } from './utils'

function httpGet<T, K>(url: string, option: T): Promise<K> {
  return new Promise((resolve, reject) => {
    liveHttp.get(url, { params: option })
      .then((res: ResponseData) => {
        if (parseInt(res.code as string) === 0) {
          resolve(objKeyToUpperCase(res.data || {}))
        } else {
          reject(new HttpError({ code: res.code, message: res.message }))
        }
      })
      .catch(e => {
        reject(new HttpError({ code: e.code, message: e.message, config: e }))
      })
  })
}

const get = async function <T, K>(url: string, option: T): Promise<[error?: HttpError, result?: K]> {
  try {
    const res: K = await httpGet(url, option)
    return [undefined, res]
  } catch (error) {
    return [error]
  }
}

export type RoomInfoOption = {
  roomStatus: 0 | 1 // 直播间状态 0 无房间  1 有房间
  roundStatus: 0 | 1 // 轮播状态 0 未轮播 1 轮播
  liveStatus: 0 | 1 // 直播状态 0 未开播  1 开播
  url: string // 直播间网页url
  cover: string // 直播间封面url
  title: string // 直播间标题
  online: number // 直播间人气
  roomid: number // 直播间ID 短号
  [key: string]: unknown
}

/**
 * 获取用户对应的房间状态
 * @param mid 用户ID
 */
export const getRoomInfoByUser = async function (mid: number): Promise<[error?: HttpError, result?: RoomInfoOption]> {
  return await get('/room/v1/Room/getRoomInfoOld', { mid })
}

export type RoomInitInfoOption = {
  roomId: number // 直播间真实ID
  shortId: number // 直播间ID（短号）
  uid: number // 主播用户UID
  needP2p: number // 是否p2p
  isHidden: boolean // 是否隐藏
  isLocked: boolean // 是否锁定
  isPortrait: boolean // 是否竖屏
  liveStatus: 0 | 1 | 2 // 直播状态   未开播 | 直播中 | 轮播中
  hiddenTill: number // 隐藏时间戳
  lockTill: number // 锁定时间戳
  encrypted: boolean // 是否加密
  pwdVerified: boolean // 加密房间是否通过密码验证
  liveTime: number // 开播时间
  isSp: 0 | 1 // 是否为特殊直播间    普通直播间 | 特殊直播间
  specialType: 0 | 1 | 2 // 特殊直播间标志   普通 | 付费 | 拜年祭
  [key: string]: unknown
}

/**
 * 获取房间初始化信息
 * 可能存在返回钓鱼信息的情况， 需要验证下 "isHidden":false,"isLocked":false,"encrypted":false则不是钓鱼房间
 * @param id 直播间短ID
 */
export const getRoomInitInfo = async function (id: number): Promise<[error?: HttpError, result?: RoomInitInfoOption]> {
  return await get('/room/v1/Room/room_init', { id })
}

export type LiveUserInfoOption = {
  followerNum: number // 粉丝数
  roomId: number // 直播间短号
  medalName: string // 粉丝勋章名
  gloryCount: number // 主播荣誉数
  pendant: string // 头像框url
  info: { // 用户信息
     uid: number
     uname: string
     face: string // 头像
     gender: -1 | 0 | 1 // 性别  保密 | 女 | 男
     officialVerify: { // 认证信息
      type: -1 | 0 | 1 // 认证类型   无 | 个人认证 | 机构认证
      desc: string // 认证信息
     }
  }
  exp: unknown // 经验
  roomNews: { // 主播公告
    content: string // 内容
    ctime: string // 公告时间
    ctimeText: string // 公告日期
  }
}

/**
 * 获取主播信息
 * @param uid 主播UID
 */
export const getLiveUserInfo = async function (uid: number): Promise<[error?: HttpError, result?: LiveUserInfoOption]> {
  return await get('/live_user/v1/Master/info', { uid })
}

type GiftDataItemOption = {
  giftId: number
  id: number
  planId: number
  position: number
  special: {
    isUse: number
    specialType: number
    tips: string
  }
}

export type GiftDataOption = {
  comboIntervalTime: number
  discountGiftList: unknown
  lotteryGiftConfig: unknown
  maxSendGift: number
  roomGiftList: {
    goldList: GiftDataItemOption[]
    silverList: GiftDataItemOption[]
  }
  tabList: unknown
}

/**
 * 获取虚拟主播房间礼物信息
 * @param roomId
 */
export const getGiftData = async function(roomId: number): Promise<[error?: HttpError, result?: GiftDataOption]> {
  return await get('/xlive/web-room/v1/giftPanel/giftData', {
    room_id: roomId,
    area_id: 371,
    area_parent_id: 9,
    attr: 'room_gift_list',
    platform: 'pc',
    source: 'live'
  })
}

export type GiftConfigItemOption = {
  id: number
  name: string
  price: number
  type:number
  gif: string
  webp: string
  giftType: number
  desc: string
  coinType: string
  imgBasic: string
  imgDynamic: string
}

export type GiftConfigOption = {
  list: GiftConfigItemOption[]
}

/**
 * 获取所有礼物配置
 * @param roomId
 */
export const getGiftConfig = async function(roomId: number): Promise<[error?: HttpError, result?: GiftConfigOption]> {
  return await get('/xlive/web-room/v1/giftPanel/giftConfig', {
    room_id: roomId,
    area_id: 371,
    area_parent_id: 9,
    platform: 'pc'
  })
}

type GuardOption = {
  uid: number
  name: string
  face: string
  isAlive: number
  guardLevel: number
}

/**
 * 获取 舰长列表
 */
export const getGuardList = async function ({ roomId, uid }: { roomId: number, uid: number }, page = 1): Promise<[error?: HttpError, result?:{ info: { page: number }, list: GuardOption[], top3: GuardOption[] }]> {
  const [err, result] = await get('/guard/topList', {
    roomid: roomId,
    ruid: uid,
    page_size: 29,
    page: page
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res: Partial<{ info: { page: number }, list: GuardOption[], top3: GuardOption[] }> = {}
  if (result) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res.info = (result as any).info
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res.top3 = (result as any).top3.map((item: any) => {
      return {
        uid: item.uid,
        name: item.username,
        face: item.face,
        isAlive: item.isAlive,
        guardLevel: item.guardLevel
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res.list = (result as any).list.map((item: any) => {
      return {
        uid: item.uid,
        name: item.username,
        face: item.face,
        isAlive: item.isAlive,
        guardLevel: item.guardLevel
      }
    })
  }
  return [err, res as { info: { page: number }, list: GuardOption[], top3: GuardOption[] }]
}

export type BilibiliUserInfo = {
  mid: number
  name: string
  level: number
  face: string
  roomId: number
  sign: string
}

export const getBilibiliUserInfo = async (mid: number): Promise<[error?: HttpError, result?: BilibiliUserInfo]> => {
  // https://api.bilibili.com/x/space/acc/info?mid=2002354376&jsonp=jsonp
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [error, result] = await get<any, any>('/x/space/acc/info', { mid, jsonp: 'jsonp' })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res: BilibiliUserInfo = {
    mid,
    name: '',
    level: 0,
    face: '',
    roomId: 0,
    sign: ''
  }
  if (result) {
    res.mid = result.mid
    res.name = result.name
    res.level = result.level
    res.face = result.face
    res.sign = result.sign
    res.roomId = result.live_room.roomid
  }
  return [error, res]
}
