import { getVtbsShortList, ShortVtbOptionItem } from '/@/plugins/BilibiliAPI'
import { useService } from '/@/hooks/service'
// import * as ipc from './ipc'

const maxUpdateTime = 86400000 * 1
export const fetchVtbsShortList = async (): Promise<ShortVtbOptionItem[] | undefined> => {
  const { getVtbShortList, setVtbShortList } = useService('DataBaseService')
  const { lastUpdateTime, list } = await getVtbShortList()
  const now = Date.now()
  if (!lastUpdateTime || now - lastUpdateTime > maxUpdateTime || list.length === 0) {
    const [err, shortList] = await getVtbsShortList()
    if (err) return
    shortList && await setVtbShortList(shortList)
    return shortList
  }
  return list
}
