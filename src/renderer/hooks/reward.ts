// 奖品配置

import { computed, ref } from 'vue'
import { useService } from './service'
import _ from 'lodash'

export type RewardOption = {
  id: number
  name: string // 礼品名称
  member: number // 抽取数量
  type: number // 1 弹幕口令  2 仅从舰长中抽取 3礼物
  command?: string // 弹幕口令
  gift: { // 礼物配置
    id: number // 礼物ID
    count: number // 礼物数量
  }
}

const defaultRewardConfig: RewardOption[] = [
  {
    id: 1,
    name: '舰长抽Mua',
    member: 1,
    type: 2,
    command: '',
    gift: { id: 0, count: 1 }
  },
  {
    id: 2,
    name: '弹幕抽Mua',
    member: 1,
    type: 1,
    command: 'mua',
    gift: { id: 0, count: 1 }
  },
  {
    id: 3,
    name: '禁言10分钟',
    member: 1,
    type: 1,
    command: '1',
    gift: { id: 0, count: 1 }
  },
  {
    id: 4,
    name: '舰长组CP',
    member: 2,
    type: 2,
    command: '',
    gift: { id: 0, count: 1 }
  },
  {
    id: 5,
    name: '撒娇',
    member: 1,
    type: 1,
    command: '海葵可爱',
    gift: { id: 0, count: 1 }
  }
]

const rewardTypeList = [
  { label: '弹幕口令', value: 1 },
  { label: '仅限舰长', value: 2 },
  { label: '赠送礼物', value: 3 }
]

const rewardConfigList = ref<RewardOption[]>([])
const current = ref<number>(0)

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useRewardConfig() {
  const databaseService = useService('DataBaseService')
  const { getRewardConfig, setRewardConfig, getCurrentReward } = databaseService

  const initRewardConfig = async () => {
    const config = await getRewardConfig<RewardOption[]>()
    current.value = await getCurrentReward() || 0
    if (config) {
      rewardConfigList.value = config.map(_ => ({ ..._, gift: _.gift || { id: 0, count: 1 } }))
    } else {
      rewardConfigList.value = [...defaultRewardConfig]
      await setRewardConfig<RewardOption[]>(_.cloneDeep(rewardConfigList.value))
      const id = rewardConfigList.value[0].id
      current.value = id
      databaseService.setCurrentReward(id)
    }
  }

  const update = async () => {
    await setRewardConfig<RewardOption[]>(_.cloneDeep(rewardConfigList.value))
  }
  const addRewardConfig = async (config: Partial<RewardOption>) => {
    config.id = Date.now()
    rewardConfigList.value = [config as RewardOption, ...rewardConfigList.value]
    await update()
  }

  const removeRewardConfig = async (id: number) => {
    rewardConfigList.value = rewardConfigList.value.filter((config: RewardOption) => config.id !== id)
    await update()
    console.log(current.value, id)
    if (id === current.value) {
      current.value = rewardConfigList.value[0].id
      await databaseService.setCurrentReward(current.value)
    }
  }

  const updateRewardConfig = async (config: RewardOption) => {
    const index = rewardConfigList.value.findIndex(({ id }: RewardOption) => config.id === id)
    if (index === -1) return
    rewardConfigList.value[index] = config
    await update()
  }

  const setCurrentReward = async (id: number) => {
    current.value = id
    await databaseService.setCurrentReward(id)
  }

  const currentReward = computed((): Partial<RewardOption> => {
    return rewardConfigList.value.find(({ id }: RewardOption) => Number(id) === Number(current.value)) || {}
  })

  const getRewardTypeByValue = (value: number) => {
    const item = rewardTypeList.find(_ => _.value === value)
    return item ? item.label : ''
  }

  return {
    rewardConfigList,
    currentReward,
    initRewardConfig,
    addRewardConfig,
    updateRewardConfig,
    removeRewardConfig,
    setCurrentReward,
    rewardTypeList,
    getRewardTypeByValue
  }
}
