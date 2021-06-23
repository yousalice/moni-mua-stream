import { ref } from 'vue'
import { useService } from './service'
import _ from 'lodash'

export type BlackMemberOption = {
  uid: number,
  name: string
}

const blackList = ref<BlackMemberOption[]>([])
const { setBlackList, getBlackList } = useService('DataBaseService')

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useBlack() {
  const initBlackList = async () => {
    blackList.value = await getBlackList() || []
  }

  const update = async () => {
    await setBlackList(_.cloneDeep(blackList.value))
  }

  const hasBlack = (uid: number) => {
    return blackList.value.some((item: BlackMemberOption) => item.uid === uid)
  }

  const addBlack = async ({ uid, name }: BlackMemberOption) => {
    if (!hasBlack(uid)) {
      blackList.value = [...blackList.value, { uid, name }]
    }
    await update()
  }

  const removeBlack = async (blackMember: BlackMemberOption) => {
    blackList.value = blackList.value.filter(item => item.uid !== blackMember.uid)
    await update()
  }

  const clearBlack = async () => {
    blackList.value = []
    await update()
  }

  return {
    blackList,
    initBlackList,
    hasBlack,
    addBlack,
    removeBlack,
    clearBlack
  }
}
