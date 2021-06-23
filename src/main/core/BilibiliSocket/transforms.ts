import { LiveCmd, getGuard } from '/@shared/index'
import type { callback } from './index'

export const transformMap: Record<string, callback> = {
  // LIVE  开始直播
  [LiveCmd.LIVE]({ data = {} }): LiveOrPreparingOption {
    return { roomId: parseInt(data.roomid) }
  },
  // PREPARING  直播结束
  [LiveCmd.PREPARING]({ data = {} }): LiveOrPreparingOption {
    return { roomId: parseInt(data.roomid) }
  },
  [LiveCmd.CUT_OFF]({ data = {} }): CuteOffOption {
    return { msg: data.msg }
  },
  // 人气值
  [LiveCmd.OPERATION]({ data = {} }): OperationOption {
    return { count: data.count }
  },
  // DANMU_MSG 弹幕信息
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [LiveCmd.DANMU_MSG]({ info = [] }: { info: any[] }): DanMuMsgOption {
    const [uid, name, isAdmin] = info[2]
    const [
      medalLevel, medalName, medalAnchorName, medalRoomId, medalColor, , ,
      medalColorBorder, medalColorStart, medalColorEnd, guardLevel
    ] = info[3]
    const res: Partial<DanMuMsgOption> = {
      timestamp: info[0][3], // 发送时间
      comment: info[1],
      sender: {
        uid,
        name,
        isAdmin, // 房管
        guardLevel: info[7]
      }
    }
    if (medalLevel && medalName) {
      res.medal = {
        level: medalLevel,
        name: medalName,
        owner: medalAnchorName,
        roomId: medalRoomId,
        guardLevel: guardLevel,
        color: `#${medalColor.toString(16).padStart(6, '0')}`,
        borderColor: `#${medalColorBorder.toString(16).padStart(6, '0')}`,
        colorStart: `#${medalColorStart.toString(16).padStart(6, '0')}`,
        colorEnd: `#${medalColorEnd.toString(16).padStart(6, '0')}`
      }
    }
    return res as DanMuMsgOption
  },

  // SEND_GIFT 投喂礼物
  [LiveCmd.SEND_GIFT]({ data = {} }): SendGiftOption {
    // eslint-disable-next-line camelcase
    const medalInfo = data.medal_info || {}
    const res: SendGiftOption = {
      action: data.action,
      sender: {
        name: data.uname,
        uid: data.uid,
        face: data.face,
        guardLevel: data.guard_level
      },
      medal: {
        level: medalInfo.medal_level,
        name: medalInfo.medal_name,
        guardLevel: medalInfo.guard_level,
        guardName: getGuard(medalInfo.guard_level)
      },
      gift: {
        id: data.giftId,
        name: data.giftName,
        type: data.giftType,
        price: data.price
      },
      giftCount: data.num,
      superGiftCount: data.super_gift_num,
      timestamp: data.timestamp,
      remain: data.remain,
      coinType: data.coin_type,
      totalCoin: data.total_coin,
      effectBlock: data.effect_block
    }
    const blind = data.blind_gift
    if (blind) {
      res.blindGift = {
        configId: blind.blind_gift_config_id,
        action: blind.gift_action,
        originalGiftId: blind.original_gift_id,
        originalGiftName: blind.original_gift_name
      }
    }
    return res
  },
  // INTERACT_WORD  用户互动， 如进入直播间、关注主播等
  [LiveCmd.INTERACT_WORD]({ data = {} }): InteractOption {
    const res: InteractOption = {
      uid: data.uid,
      name: data.name,
      type: data.msg_type, // 1 进入， 2 关注， 3 分享， 4 特别关注 5 互相关注
      timestamp: data.timestamp,
      triggerTime: data.trigger_time
    }
    if (data.fans_medal) {
      res.medal = {
        name: data.fans_medal.medal_name,
        level: data.fans_medal.medal_level,
        guardLevel: data.fans_medal.guard_level,
        guardName: getGuard(data.fans_medal.guard_level)
      }
    }
    return res
  },

  // ENTRY_EFFECT 欢迎舰长
  [LiveCmd.ENTRY_EFFECT]({ data = {} }): EntryEffectOption {
    const msg = data.copy_writing || ''
    const name = msg.match(/<%(.+?)%>/)
    return {
      uid: data.uid,
      name: name && name[1],
      face: data.face,
      guardLevel: data.privilege_type,
      guardName: getGuard(data.privilege_type)
    }
  },
  // GUARD_BUY 上舰
  [LiveCmd.GUARD_BUY]({ data = {} }): GuardBuyOption {
    return {
      uid: data.uid,
      name: data.username,
      guardLevel: data.guard_level,
      guardName: getGuard(data.guard_level),
      guardCount: data.num
    }
  },
  // SUPER_CHAT_MESSAGE 醒目留言
  [LiveCmd.SUPER_CHAT_MESSAGE]({ data = {} }): SuperChatMessageOption {
    const user = data.user_info || {}
    const medal = data.medal_info || {}
    const gift = data.gift || {}
    return {
      id: data.id,
      message: data.message,
      price: data.price,
      startTime: data.start_time,
      endTime: data.end_time,
      time: data.time,
      sender: {
        uid: data.uid,
        name: user.uname,
        face: user.face,
        faceFrame: user.face_frame,
        guardLevel: user.guard_level,
        guardName: getGuard(user.guard_level)
      },
      medal: {
        level: medal.medal_level,
        name: medal.medal_name,
        guardLevel: medal.guard_level,
        guardName: getGuard(medal.guard_level)
      },
      gift: {
        id: gift.gift_id,
        name: gift.gift_name,
        num: gift.num
      }
    }
  },
  // SUPER_CHAT_MESSAGE_JP 醒目留言 带日文
  [LiveCmd.SUPER_CHAT_MESSAGE_JP]({ data = {} }): SuperChatMessageOption {
    const user = data.user_info || {}
    const medal = data.medal_info || {}
    const gift = data.gift || {}
    return {
      id: data.id,
      message: data.message,
      messageJpn: data.message_jpn,
      price: data.price,
      startTime: data.start_time,
      endTime: data.end_time,
      time: data.time,
      sender: {
        uid: data.uid,
        name: user.uname,
        face: user.face,
        faceFrame: user.face_frame,
        guardLevel: user.guard_level,
        guardName: getGuard(user.guard_level)
      },
      medal: {
        level: medal.medal_level,
        name: medal.medal_name,
        guardLevel: medal.guard_level,
        guardName: getGuard(medal.guard_level)
      },
      gift: {
        id: gift.gift_id,
        name: gift.gift_name,
        num: gift.num
      }
    }
  }
  // 礼物排行榜
  // [LiveCmd.GIFT_TOP]({ data = [] }): GiftTopItemOption[] {
  //   data = data || []
  //   return data.map((d: Record<string, unknown>) => ({
  //     uid: d.uid,
  //     name: d.name,
  //     coin: d.coin
  //   }))
  // }
}
