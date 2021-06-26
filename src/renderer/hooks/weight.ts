import { ref } from 'vue'
import { useRankList } from './rank'

// 权重与重复抽取次数， [0, 1] 描述的是 大于0且小于等于1次
// 权重越高概率越高
// 概率计算为 个人权重/总权重（所有人权重之和）
const weightConfig = {
  default: 30, // 默认权重
  max: 600, // 最大 600， 20倍
  min: 1, // 最小 1， 1/30
  list: [
    { weight: 8, area: [0, 1] },
    { weight: 6, area: [1, 2] },
    { weight: 4, area: [2, 4] },
    { weight: 2, area: [4, 6] },
    { weight: 1, area: [6, Number.MAX_SAFE_INTEGER] } // 欧吃矛！
  ]
}

export function getWeightByRank(count: number): number {
  for (let i = 0, l = weightConfig.list.length; i < l; i++) {
    const { weight, area } = weightConfig.list[i]
    const [min, max] = area
    if (count > min && count <= max) {
      return weight
    }
  }
  return weightConfig.default
}

export type WeightOption = {
  uid: number
  weight: number
}

const weightList = ref<WeightOption[]>([])

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useWeight() {
  const { rankList } = useRankList()

  const getCount = (uid: number) => {
    const member = rankList.value.find(_ => _.uid === uid)
    return member ? member.count : 0
  }

  const addWeight = (uid: number, weight: number) => {
    const index = weightList.value.findIndex(item => item.uid === uid)
    if (index === -1) {
      weightList.value = [...weightList.value, { uid, weight }]
    } else {
      weightList.value[index].weight = weight
    }
    weightList.value = weightList.value.filter(_ => {
      if (rankList.value.some(rank => rank.uid === _.uid)) {
        return true
      } else {
        return Number(_.weight) !== weightConfig.default
      }
    })
  }

  const resetWeight = (uid: number) => {
    addWeight(uid, weightConfig.default)
  }

  const clearWeight = () => {
    weightList.value = []
  }

  const getWeight = (uid: number) => {
    const item = weightList.value.find(item => item.uid === uid)
    if (item) {
      return item.weight
    }
    const count = getCount(uid)
    if (count) {
      return getWeightByRank(count)
    }
    return weightConfig.default
  }

  return {
    weightList,
    addWeight,
    resetWeight,
    getWeight,
    clearWeight,
    weightConfig: {
      default: weightConfig.default,
      max: weightConfig.max,
      min: weightConfig.min
    }
  }
}
