import { GuardLevelEnum, LiveStatusEnum } from './enum'

export interface guardOption {
  level: number,
  name: string
}

export const guardMap: guardOption[] = [
  { level: GuardLevelEnum.Captain, name: '舰长' },
  { level: GuardLevelEnum.Prefect, name: '提督' },
  { level: GuardLevelEnum.Governor, name: '总督' }
]

export function getGuard(level: GuardLevelEnum): string {
  const guard = guardMap.find(guard => guard.level === level)
  return guard ? guard.name : ''
}

export interface LiveStatusOption {
  label: string,
  value: number
}

export const LiveStatusMap: LiveStatusOption[] = [
  { label: '未开播', value: LiveStatusEnum.Closed },
  { label: '直播中', value: LiveStatusEnum.Open },
  { label: '轮播中', value: LiveStatusEnum.Round }
]

export function getLiveStatus(status: LiveStatusEnum): string {
  const liveStatus = LiveStatusMap.find(liveStatus => liveStatus.value === status)
  return liveStatus ? liveStatus.label : ''
}
