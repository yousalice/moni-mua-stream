import { ref } from 'vue'
import { getGiftConfig, getGiftData, GiftConfigItemOption } from '/@/plugins/BilibiliAPI'
import _ from 'lodash'
import { useRewardConfig } from './reward'
import { usePlay } from './play'
import { useMember } from './member'

export type GiftItemOption = {
  id: number
  name: string
  price: number
}

export type SenderGiftItemOption = {
  sender: { uid: number; name: string, guardLevel: number; face?: string }
  gift: GiftItemOption
  count: number
  timestamp: number,
  isCondition: boolean
}

const giftList = ref<GiftItemOption[]>([])

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useGift() {
  const initGiftList = async () => {
    const [err1, giftData] = await getGiftData(23001181)
    const [err2, giftConfig] = await getGiftConfig(23001181)
    if (err1 || err2) {
      await initGiftList()
      return
    }
    const roomGiftData = giftData?.roomGiftList.goldList || []
    const roomGiftConfig = giftConfig?.list || []
    const giftConfigObj: Record<number, GiftConfigItemOption> = {}
    roomGiftConfig.forEach(config => {
      giftConfigObj[config.id] = config
    })
    const list: GiftItemOption[] = []
    roomGiftData.forEach(item => {
      const config = giftConfigObj[item.giftId]
      list.push({
        id: item.giftId,
        name: config.name,
        price: config.price / 1000
      })
    })
    giftList.value = _.orderBy(list, 'price', 'asc').filter(_ => _.price <= 100)
  }

  const getGiftName = (id:number): string => {
    const gift = giftList.value.find(_ => _.id === id)
    return gift ? gift.name : ''
  }

  return {
    initGiftList,
    giftList,
    getGiftName
  }
}

let senderGiftMap: Record<string, SenderGiftItemOption> = {}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useSenderGift() {
  const { currentReward } = useRewardConfig()
  const { isMonitor } = usePlay()
  const { addMember } = useMember()

  const addSenderGift = ({ sender, gift, giftCount, timestamp, blindGift }: SendGiftOption) => {
    const reward = currentReward.value || {}
    // ??????????????????????????????????????????????????????????????????
    if (reward.type !== 3 || !isMonitor.value) return
    // ???????????????????????????
    if (!(reward.gift?.id === gift.id || (blindGift && blindGift.originalGiftId === reward.gift?.id))) return
    const key = sender.uid + '-' + gift.id
    // ?????????????????????????????????????????????????????????????????????????????????
    if (senderGiftMap[key] && senderGiftMap[key].isCondition) return

    if (senderGiftMap[key]) { // ????????????????????????
      senderGiftMap[key].count += giftCount
    } else {
      senderGiftMap[key] = {
        sender: { ...sender, guardLevel: sender.guardLevel || 0 },
        gift: { id: gift.id, name: gift.name, price: gift.price || 0 },
        count: giftCount,
        timestamp,
        isCondition: false
      }
    }
    // ??????????????????????????????
    if (senderGiftMap[key].count >= (reward.gift?.count || 0)) {
      const sender = senderGiftMap[key].sender
      senderGiftMap[key].isCondition = true
      addMember({
        uid: sender.uid,
        name: sender.name,
        guardLevel: sender.guardLevel || 0,
        type: 1,
        isAlive: 1
      })
    }
  }

  const clearSenderGift = () => {
    senderGiftMap = {}
  }

  return {
    addSenderGift,
    clearSenderGift
  }
}
