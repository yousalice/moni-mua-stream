import { ref } from 'vue'
import { useService } from './service'

export type VtuberOption = {
  uid: number
  roomId: number
  name: string
}
const configList: VtuberOption[] = [
  { uid: 8881297, roomId: 55634, name: '钉宫妮妮Ninico' },
  { uid: 541696090, roomId: 22340341, name: '早见咲Saki' },
  { uid: 2143967328, roomId: 22768399, name: '纪代因果_Inga' },
  { uid: 1617739681, roomId: 22791567, name: '立花遥はるか' },
  { uid: 1043321643, roomId: 23084794, name: '秋兎满月' },
  { uid: 1589117610, roomId: 23001181, name: '朝海沫霓Moni' },
  { uid: 1870008548, roomId: 23011547, name: '早雾聖奈' },
  { uid: 1731513328, roomId: 23035157, name: '雨宮依亜' },
  { uid: 2044990400, roomId: 23067852, name: '飞鳥夜' },
  { uid: 1434788295, roomId: 23012235, name: '成海晴爱' },
  { uid: 1408050616, roomId: 23078584, name: '林原白夜' },
  { uid: 1632064048, roomId: 23032287, name: '伊吹千代' },
  { uid: 1765846847, roomId: 23092245, name: '結城梓Azusa' },
  { uid: 2002354376, roomId: 23135755, name: '恋水時Toki' },
  { uid: 1939655172, roomId: 23047523, name: '弥海星砂' },
  { uid: 1405060701, roomId: 23146554, name: 'Jelly_DAIBI' },
  { uid: 1214419475, roomId: 23193473, name: '天瀬椿' },
  { uid: 1184151952, roomId: 23030935, name: '東雲凪Nagi' },
  { uid: 670124663, roomId: 22939278, name: 'Chobits-live' }
]

const service = useService('DataBaseService')

const chobitsConfigList = ref<VtuberOption[]>(configList)

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useChobitsConfig() {
  const currentVtuber = ref<VtuberOption>()
  const getCurrentVtuber = async () => {
    if (currentVtuber.value) {
      return currentVtuber.value
    }
    const uid = await service.getCurrentVtuber()
    if (uid) {
      const vtuber = chobitsConfigList.value.find(_ => _.uid === uid)
      currentVtuber.value = vtuber
      return vtuber
    }
  }
  const setCurrentVtuber = async (vtuber: VtuberOption) => {
    currentVtuber.value = vtuber
    await service.setCurrentVtuber(vtuber.uid)
  }
  return {
    chobitsConfigList,
    currentVtuber,
    setCurrentVtuber,
    getCurrentVtuber
  }
}
