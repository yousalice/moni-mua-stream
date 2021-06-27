<template>
  <div class="home-wrapper w-full h-full pb-5">
    <div class="flex h-full">
      <div class="flex-1">
        <RewardMessage @setting="showSetting = true"/>
        <div class="stage p-5 m-5 bg-white shadow-md moni:shadow-none moni:bg-transparent moni:border-4 moni:border-gray-400 rounded-md flex overflow-y-auto no-scrollbar">
          <div class="m-auto text-center">
            <span
              v-for="member in pickList"
              :key="member.uid"
              class="inline-block ml-8 mr-8 mt-5 mb-5 border-gray-400"
              :class="{ 'text-gray-300 moni:text-gray-500': member.isAlive === 0 }"
            >
              {{ member.name }}
            </span>
          </div>
        </div>
        <div v-if="IS_MONI || isMoni" class="pl-4 text-xl flex items-center select-none">
          <p class="flex-1 flex items-center">
            <span class="cursor-pointer" :class="{ 'text-gray-400': pickType === 1 }" @click="pickType = 0">随机抽奖</span>
            <span class="text-3xl pl-4 pr-4" :class="pickType == 0 ? 'el-icon-turn-off' : 'el-icon-open'"></span>
            <span class="cursor-pointer" :class="{ 'text-gray-400': pickType === 0 }" @click="pickType = 1">漏斗式抽奖</span>
          </p>
        </div>
        <div class=" text-center">
          <span v-if="pickType === 0" class="button pick" @click="onRandomPickV1">{{ active ? '结束' : '开始' }}抽奖</span>
          <span v-else class="button pick" @click="onRandomPickV2"> {{ buttonText }}</span>
        </div>
        <div class="m-5">
          <span class="button mr-5" @click="showRank = true">刀了榜</span>
          <span class="button mr-5" @click="showAward = true">获奖统计</span>
          <span class="button mr-5" @click="showBlack = true">黑名单</span>
          <span class="button" @click="showRule = true">使用说明</span>
        </div>
      </div>
      <MemberList />
    </div>
    <DialogSetting :show="showSetting" @close="showSetting = false" />
    <DialogAward :show="showAward" @close="showAward = false" />
    <DialogRank :show="showRank" @close="showRank = false" />
    <DialogBlack :show="showBlack" @close="showBlack = false" />
    <DialogRule  :show="showRule" @close="showRule = false" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import RewardMessage from '/@/components/RewardMessage.vue'
import DialogSetting from '/@/components/DialogSetting.vue'
import DialogAward from '/@/components/DialogAward.vue'
import DialogRank from '/@/components/DialogRank.vue'
import DialogBlack from '/@/components/DialogBlack.vue'
import DialogRule from '/@/components/DialogRule.vue'
import MemberList from '/@/components/MemberList.vue'
import { usePlay, useRandomPick } from '/@/hooks'

export default defineComponent({
  name: 'Home',
  components: { RewardMessage, DialogSetting, DialogAward, DialogRank, DialogBlack, DialogRule, MemberList },
  setup() {
    const { active, buttonText, pickList, pickType, onRandomPickV1, onRandomPickV2 } = useRandomPick()

    const showSetting = ref(false)
    const showAward = ref(false)
    const showRank = ref(false)
    const showBlack = ref(false)
    const showRule = ref(false)
    const { isMoni } = usePlay()
    const IS_MONI = ref(__IS_MONI__)

    return {
      showSetting,
      showAward,
      showRank,
      showBlack,
      showRule,
      active,
      buttonText,
      pickList,
      pickType,
      onRandomPickV1,
      onRandomPickV2,
      IS_MONI,
      isMoni
    }
  }
})
</script>
<style lang="postcss">
.stage {
  height: calc(100vh - 520px)
}

.input {
  outline: 0;
  background-color: transparent;
  @apply border-b border-gray-500 text-gray-700;
}

.theme-moni .input {
  outline: 0;
  background-color: transparent;
  border-bottom: solid 2px #ccc;
  color: #ccc;
}

.button {
  @apply inline-block text-2xl border-2 border-gray-600;
  @apply pl-5 pr-5 pt-1 pb-1 bg-white;
  @apply rounded-md cursor-pointer select-none;
}

.theme-moni .button{
  @apply border-4 border-gray-400 bg-transparent;
}

.button.pick {
  @apply border-yellow-600 text-4xl text-yellow-600;
}

.button.small {
  @apply text-xl border-2
}

</style>

function __IS_MONI__(__IS_MONI__: any) {
  throw new Error('Function not implemented.')
}

function __IS_MONI__(__IS_MONI__: any) {
  throw new Error('Function not implemented.')
}
