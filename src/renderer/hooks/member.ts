import { ref } from 'vue'

export type MemberOption = {
  name: string,
  uid: number,
  guardLevel: number // 舰长等级
  face?: string // 头像 在当前版本中先不用
  isAlive?: number // 是否在线 仅限从舰长接口拉取的人有判断， 弹幕礼物添加默认在线
  type?: 0 | 1 // 0 自动添加  1 弹幕或礼物添加
}

const memberList = ref<MemberOption[]>([])
const memberIdSet = new Set<number>()

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useMember() {
  const addMember = (member: MemberOption) => {
    if (memberIdSet.has(member.uid)) {
      const index = memberList.value.findIndex(({ uid }) => uid === member.uid)
      index !== -1 && (memberList.value[index] = {
        ...memberList.value[index],
        ...member
      })
      return
    }
    memberList.value = [...memberList.value, member]
    memberIdSet.add(member.uid)
  }

  const setMemberList = (list: MemberOption[]) => {
    memberList.value = [...list]
  }

  const clearMember = () => {
    memberList.value = []
    memberIdSet.clear()
  }

  return {
    memberList,
    addMember,
    clearMember,
    setMemberList
  }
}
