import { useService } from './service'
import { ref } from 'vue'
import _ from 'lodash'

export type AwardOption = {
  uid: number
  name: string
  reward: string,
  time: number
}

const awardList = ref<AwardOption[]>([])
const { setAwardList, getAwardList } = useService('DataBaseService')

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useAward() {
  const initAwardList = async () => {
    const list: AwardOption[] = await getAwardList() || []
    awardList.value = _.orderBy(list, 'time', 'desc')
  }

  const update = async () => {
    await setAwardList(_.cloneDeep(awardList.value))
  }

  const addAward = async (award: Partial<AwardOption>) => {
    award.time = Date.now()
    awardList.value = _.orderBy([...awardList.value, award as AwardOption], 'time', 'desc')
    await update()
  }

  const removeAward = async (index: number) => {
    awardList.value.splice(index, 1)
    await update()
  }

  const clearAward = async () => {
    awardList.value = []
    await update()
  }

  return {
    initAwardList,
    awardList,
    addAward,
    removeAward,
    clearAward
  }
}
