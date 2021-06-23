import { getRoomInfoByUser, getLiveUserInfo, getRoomInitInfo } from '/@/plugins/BilibiliAPI'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function fetchUserAndLiveInfo(mid: number) {
  const [[liveError, liveInfo], [userError, userInfo]] = await Promise.all([
    getRoomInfoByUser(mid),
    getLiveUserInfo(mid)
  ])
  const [roomError, roomInfo] = await getRoomInitInfo(liveInfo?.roomid as number)

  return {
    error: liveError || userError || roomError,
    liveInfo,
    userInfo,
    roomInfo
  }
}
