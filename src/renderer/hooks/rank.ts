import _ from 'lodash'
import { ref } from 'vue'
import { useService } from './service'

type RankItemOption = {
  uid: number
  name: string
  count: number
}

const rankList = ref<RankItemOption[]>([])
const { setRankList, getRankList } = useService('DataBaseService')

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useRankList = () => {
  const initRankList = async () => {
    rankList.value = await getRankList() || []
  }

  const update = async () => await setRankList(_.cloneDeep(rankList.value))

  const addRank = async (rank: Partial<RankItemOption>) => {
    const index = rankList.value.findIndex(item => item.uid === rank.uid)
    if (index === -1) {
      rankList.value = [...rankList.value, {
        uid: rank.uid as number,
        name: rank.name as string,
        count: 1
      }]
    } else {
      rankList.value[index].count = (rankList.value[index].count || 0) + 1
      rankList.value[index].name = rank.name as string
    }
    rankList.value = _.orderBy(rankList.value, ['count'], ['desc'])
    await update()
  }

  const removeRank = async (uid: number) => {
    const i = rankList.value.findIndex(_ => _.uid === uid)
    if (i !== -1) {
      rankList.value[i].count -= 1
    }
    if (i === -1 || rankList.value[i].count === 0) {
      rankList.value = rankList.value.filter(_ => _.uid !== uid)
    }
    rankList.value = _.orderBy(rankList.value, ['count'], ['desc'])
    await update()
  }

  const clearRank = async () => {
    rankList.value = []
    await update()
  }

  return {
    rankList,
    initRankList,
    addRank,
    clearRank,
    removeRank
  }
}
