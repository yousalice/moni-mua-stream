<template>
  <div class="member-list-wrapper moni:border-l-4 moni:border-gray-400 p-5 mt-5 mr-5 moni:mt-0 moni:mr-0 bg-white moni:bg-transparent shadow-md moni:shadow-none">
    <div class="flex items-end justify-between">
      <span v-if="currentReward.type !== 2" class="button" @click="onMonitor">{{ isMonitor ? '结束' : '开始' }}报名</span>
      <span v-if="currentReward.type !== 2" class="button" @click="onReset">重置</span>
      <p v-if="currentReward.type === 2" class="flex items-center cursor-pointer select-none" @click="filterOnLine = !filterOnLine">
        <span :class="filterOnLine ? 'el-icon-open' : 'el-icon-turn-off text-gray-500'"></span>
        <span class="text-lg ml-2">过滤不在线舰长</span>
      </p>
    </div>
    <div class="mt-5">
      <h3 class="flex items-end">
        <span class="flex-1">报名名单</span>
        <small class="text-xl">参与人数： {{ memberList.length }}</small>
      </h3>
    </div>
    <div class="member-list mt-0.5 overflow-y-auto no-scrollbar" :ref="el => memberEl = el">
      <p
        v-for="member in memberList"
        :key="member.uid"
        class="member flex item-center group"
        :class="{ 'offline': member.isAlive === 0, 'line-through': hasBlack(member.uid) }"
      >
        <span>[<input
          type="text"
          class="w-10 moni:w-9 bg-transparent outline-none text-center"
          :value="getWeight(member.uid)"
          @input="onInput($event)"
          @blur="onBlur($event, member.uid)"
        >]</span>
        <span class="flex-1 ml-1 flex-shrink-0 truncate mr-2">{{ member.name }}</span>
        <span class="cursor-pointer opacity-0 group-hover:opacity-100" @click="addForceOnline(member.uid)">在线</span>
        <span class="ml-2 cursor-pointer opacity-0 group-hover:opacity-100" @click="addBlack(member)">黑</span>
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, nextTick, watch } from 'vue'
import { useMessage, useMember, useRewardConfig, useGuardList, usePlay, useBlack, useWeight, useSenderGift } from '/@/hooks'

export default defineComponent({
  name: 'MemberList',
  setup() {
    const { memberList, addMember, clearMember, setMemberList } = useMember()
    const { onDanMuMsg, onSendGift } = useMessage()
    const { currentReward } = useRewardConfig()
    const { guardList } = useGuardList()
    const { isMonitor } = usePlay()
    const { hasBlack, addBlack } = useBlack()
    const { getWeight, addWeight, weightConfig } = useWeight()
    const { addSenderGift, clearSenderGift } = useSenderGift()

    const memberEl = ref(null)
    const filterOnLine = ref(false)
    const forceOnline = ref<number[]>([])
    const onMonitor = () => {
      isMonitor.value = !isMonitor.value
    }

    const addForceOnline = (uid: number) => {
      !forceOnline.value.includes(uid) && forceOnline.value.push(uid)
    }

    const onReset = () => {
      clearMember()
      clearSenderGift()
      isMonitor.value = false
    }

    watch([guardList, currentReward, filterOnLine, forceOnline], () => {
      if (currentReward.value.type === 2) {
        clearMember()
        setMemberList(guardList.value
          .filter(guard => filterOnLine.value ? (guard.isAlive === 1 || forceOnline.value.includes(guard.uid)) : true)
          .map(guard => {
            return {
              uid: guard.uid,
              name: guard.name,
              type: 0,
              guardLevel: guard.guardLevel,
              isAlive: guard.isAlive || (forceOnline.value.includes(guard.uid) ? 1 : 0),
              face: guard.face
            }
          }))
      }
    }, { immediate: true, deep: true })

    watch([currentReward], () => {
      if (currentReward.value.type !== 2) {
        onReset()
      }
    })

    onDanMuMsg(async ({ comment, sender }) => {
      if (!isMonitor.value) return
      let { type, command = '', glob = false } = currentReward.value
      comment = comment.trim()
      command = command?.trim()
      command = (command !== '*' && glob) ? `^${command}$` : command
      // 弹幕口令， 且 口令匹配上
      // 不做全匹配，只要发送的弹幕中有一段包含即可
      if (type === 1 && (command === '*' || new RegExp(command).test(comment))) {
        addMember({
          uid: sender.uid,
          name: sender.name,
          guardLevel: sender.guardLevel as number,
          type: 1,
          isAlive: 1
        })
        await nextTick()
        if (memberEl.value) {
          const el = memberEl.value as unknown as HTMLElement
          el.scrollTop = el.scrollHeight
        }
      }
    })

    onSendGift(addSenderGift)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onInput = async (_e: any) => {
      const weight = _e.target.value
      if (!weight) return
      if (weight < weightConfig.min) {
        _e.target.value = weightConfig.min
      }
      if (weight > weightConfig.max) {
        _e.target.value = weightConfig.max
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onBlur = async (_e: any, uid: number) => {
      if (!_e.target.value) {
        _e.target.value = getWeight(uid)
      }
      addWeight(uid, _e.target.value)
    }

    return {
      filterOnLine,
      currentReward,
      memberList,
      memberEl,
      isMonitor,
      hasBlack,
      addBlack,
      getWeight,
      onMonitor,
      onReset,
      onInput,
      onBlur,
      addForceOnline
    }
  }
})
</script>
<style lang="postcss">
.member-list-wrapper {
  width: 500px;
}
.member-list {
  height: calc(100vh - 180px);
}
.theme-moni .member-list {
  height: calc(100vh - 190px)
}

.member {
  @apply text-2xl text-gray-700 mt-2;
}
.theme-moni .member {
  @apply text-2xl text-gray-300 mt-2;
}
.member.offline {
  @apply text-gray-300;
}
.theme-moni .member.offline {
  @apply text-gray-500;
}
</style>
