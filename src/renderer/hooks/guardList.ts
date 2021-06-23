import { ref } from 'vue'
import { getGuardList as fetchGuardList } from '/@/plugins/BilibiliAPI'

export type GuardOption = {
  uid: number
  name: string
  face: string
  isAlive: number
  guardLevel: number
}

const guardList = ref<GuardOption[]>([])
const guardNum = ref<number>(0)
const loading = ref<boolean>(false)

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useGuardList() {
  let page = 1
  let _list: GuardOption[] = []

  async function getGuardList({ uid, roomId }: { uid: number, roomId: number }) {
    const [err, data] = await fetchGuardList({ uid, roomId }, page)
    if (err || !data) return
    const { info, list, top3 } = data
    if (page === 1) {
      _list = list
    } else {
      _list = [..._list, ...list] as GuardOption[]
    }
    if (page === info.page) {
      _list = [...top3, ..._list] as GuardOption[]
      guardList.value = [..._list.filter(_ => _.isAlive === 1), ..._list.filter(_ => _.isAlive === 0)]
      page = 1
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    guardNum.value = (info as any).num
    page++
    await getGuardList({ uid, roomId })
  }

  let timer: NodeJS.Timeout
  async function autoRefresh({ uid, roomId }: { uid: number, roomId: number }) {
    if (loading.value) return
    loading.value = true
    await getGuardList({ uid, roomId })
    loading.value = false
    timer = setTimeout(async () => {
      await autoRefresh({ uid, roomId })
    }, 30000)
  }

  function closeRefresh() {
    timer && clearTimeout(timer)
  }

  return {
    guardList,
    loading,
    guardNum,
    autoRefresh,
    closeRefresh
  }
}
