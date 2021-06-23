import type { LiveUserInfoOption } from '/@/plugins/BilibiliAPI'
import { useService } from '/@/hooks/service'

export const setUserInfoHistory = async (userInfo: LiveUserInfoOption): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (userInfo as any).mid = userInfo.info.uid
  const { setUserHistory } = useService('DataBaseService')
  await setUserHistory(userInfo)
}

export const getUserInfoHistory = async (): Promise<LiveUserInfoOption[]> => {
  const { getUserHistory } = useService('DataBaseService')
  return await getUserHistory() || []
}

export const deleteUserInfoHistory = async (mid?: number): Promise<LiveUserInfoOption[]> => {
  const { deleteHistory } = useService('DataBaseService')
  return await deleteHistory(mid) || []
}

export const setCurrentUser = async (user: LiveUserInfoOption): Promise<void> => {
  const { setCurrentUser } = useService('DataBaseService')
  await setCurrentUser(user)
}

export const getCurrentUser = async (): Promise<LiveUserInfoOption> => {
  const { getCurrentUser } = useService('DataBaseService')
  return await getCurrentUser()
}
