import _ from 'lodash'
import { ref, watch } from 'vue'
import { useAward } from './award'
import { useBlack } from './black'
import { MemberOption, useMember } from './member'
import { usePlay } from './play'
import { useRankList } from './rank'
import { useRewardConfig } from './reward'
import { useWeight } from './weight'
import { useDialog } from './electron'

const dialog = useDialog()

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useRandomPick() {
  const { currentReward } = useRewardConfig()
  const { memberList } = useMember()
  const { addRank } = useRankList()
  const { blackList, hasBlack } = useBlack()
  const { getWeight } = useWeight()
  const { awardList, addAward } = useAward()
  const { isMonitor } = usePlay()
  const pickList = ref<MemberOption[]>([]) // 抽取名单
  const pickType = ref(0) // 抽取方式  0 直接随机  1 多次筛选
  const buttonText = ref<string>('开始抽奖')
  const maxStep = 4
  let stepList: number[] = []
  let step: number
  let stepNum = 0

  const memberFilter = (uid: number) => {
    // 黑名单
    if (hasBlack(uid)) return false
    // 最近12次内中奖的就别中了吧
    const _awardList = awardList.value.slice(0, 12)
    if (_awardList.some(_ => _.uid === uid)) return false
    return true
  }

  // A-Res 随机算法
  const AResPick = (list: MemberOption[], count = 1, filter = memberFilter, _weight?: number) => {
    let res: MemberOption[] = []
    const keys: Record<number, number> = {}
    list.forEach(member => {
      const uid = member.uid
      if (filter && !filter(uid)) return
      const weight = _weight || getWeight(uid)
      keys[uid] = Math.pow(Math.random(), 1 / weight)
      if (res.length < count) {
        res.push(member)
      } else {
        res = _.sortBy(res, _ => keys[_.uid])
        if (keys[res[0].uid] < keys[uid]) {
          res.shift()
          res.unshift(member)
        }
      }
    })
    return res
  }

  watch([currentReward], () => {
    pickList.value = []
  })
  watch(
    [memberList, blackList, currentReward, awardList, isMonitor],
    ([memberList, , currentReward, , isMonitor]) => {
      if (isMonitor) return
      // 实际 参与抽奖的人数应该是 排除掉 黑名单，以及 最近中奖的人数
      const totalCount = memberList.filter(({ uid }) => memberFilter(uid)).length
      const pickCount = currentReward.member || 1
      const min = pickCount + 1
      const max = pickCount * 2 + 1
      let _stepList: number[] = []
      if (totalCount > max * maxStep) {
        _stepList = [pickCount, max, 2 * max, 3 * max]
      } else if (totalCount <= max * maxStep && totalCount >= min * maxStep) {
        const l2s = Math.floor(totalCount / maxStep)
        _stepList = [pickCount, l2s, 2 * l2s, 3 * l2s]
      } else {
        const s = Math.ceil(totalCount / min)
        _stepList = new Array(s).fill((pickCount)).map((a, i) => a * (i + 1)).slice(0, 4).filter(_ => _ < totalCount)
      }
      stepList = _stepList.reverse()
      stepNum = _stepList.length
    }
  )
  watch([pickType], () => {
    pickList.value = []
    step = undefined as unknown as number
    lock = false
    buttonText.value = '开始抽奖'
  })

  const randomPick = (list:MemberOption[], count: number) => {
    const _list: MemberOption[] = []
    while (_list.length < count) {
      const random = Math.floor(Math.random() * list.length)
      const member = list[random]
      if (!_list.some(_ => _.uid === member.uid)) {
        _list.push(member)
      }
    }
    return _list
  }

  const active = ref(false)
  let timer: NodeJS.Timeout
  const onRandomPickV1 = () => {
    if (isMonitor.value) {
      dialog.showMessageBox({
        type: 'info',
        title: '提示',
        message: '请先停止报名'
      })
      return
    }
    if (memberList.value.length === 0 || (currentReward.value.member || 0) >= memberList.value.length) {
      // 参与人数不足抽取人数
      dialog.showMessageBox({
        type: 'warning',
        title: '提示',
        message: `参与人数不足，${currentReward.value.name}至少需要${(currentReward.value.member || 0) + 1}人参与`
      })
      return
    }
    if (active.value) {
      active.value = false
      timer && clearInterval(timer)
      // 调用 A-res 算法 进行 随机抽取计算
      pickList.value = AResPick(memberList.value, currentReward.value.member)
      pickList.value.forEach(async ({ uid, name }) => {
        // 更新 排名、 抽奖统计
        await addRank({ uid, name })
        await addAward({ uid, name, reward: currentReward.value.name as string })
      })
    } else {
      active.value = true
      // 随机过程仅进行伪随机实现滚动即可
      pickList.value = randomPick(memberList.value, currentReward.value.member || 1)
      timer = setInterval(() => {
        pickList.value = randomPick(memberList.value, currentReward.value.member || 1)
      }, 20)
    }
  }

  let lock = false
  const onRandomPickV2 = () => {
    if (currentReward.value.type !== 2 && isMonitor.value) {
      dialog.showMessageBox({
        type: 'info',
        title: '提示',
        message: '请先停止报名'
      })
      return
    }
    if (memberList.value.length === 0 || (currentReward.value.member || 0) >= memberList.value.length) {
      // 参与人数不足抽取人数
      dialog.showMessageBox({
        type: 'warning',
        title: '提示',
        message: `参与人数不足，${currentReward.value.name}至少需要${(currentReward.value.member || 0) + 1}人参与`
      })
      return
    }
    if (lock) return
    lock = true
    if (step === 0) {
      pickList.value = []
      step = stepNum
      lock = false
      buttonText.value = '开始抽奖'
      return
    }
    if (typeof step === 'undefined') {
      step = stepNum
    }
    const count = stepList[stepNum - step]
    if (step === stepNum) {
      pickList.value = randomPick(memberList.value, count)
      const timer = setInterval(() => {
        pickList.value = randomPick(memberList.value, count)
      }, 50)
      buttonText.value = '抽奖中...'
      setTimeout(() => {
        clearInterval(timer)
        // 调用 A-res 随机算法 仅在首次进行 加权计算
        pickList.value = AResPick(memberList.value, count)
        step--
        buttonText.value = `继续 ${count} 抽 ${stepList[stepNum - step]}`
        lock = false
      }, 2000)
    } else {
      const _list = [...pickList.value]
      pickList.value = randomPick(_list, count)
      const timer = setInterval(() => {
        pickList.value = randomPick(_list, count)
      }, 50)
      buttonText.value = '抽奖中...'
      setTimeout(() => {
        clearInterval(timer)
        // 等全 随机
        pickList.value = AResPick(pickList.value, count, () => true, 10)
        step--
        if (step > 1) {
          buttonText.value = `继续 ${count} 抽 ${stepList[stepNum - step]}`
        }
        if (step === 1) {
          buttonText.value = '揭晓结果'
        }
        if (step === 0) {
          buttonText.value = '重置'
          pickList.value.forEach(async ({ uid, name }) => {
            await addRank({ uid, name })
            await addAward({ uid, name, reward: currentReward.value.name as string })
          })
        }
        lock = false
      }, 2000)
    }
  }

  return {
    active,
    buttonText,
    pickType,
    onRandomPickV1,
    onRandomPickV2,
    pickList
  }
}
