<template>
  <div class="bg-white m-5 shadow-md moni:bg-transparent moni:m-0 moni:shadow-none">
    <div class=" pt-5 ml-5 text-4xl text-center moni:text-5xl">
      <span>奖品：</span>
      <span>{{ currentReward.name }}</span>
    </div>
    <div class="pt-5 ml-5">
      <template v-if="currentReward.type === 1">
        <template v-if="currentReward.command !== '*'">
          <div class="flex items-end">
            <p class="">
              <span>弹幕口令：</span>
              <span>{{  currentReward.command }}</span>
            </p>
            <p class=" text-gray-400 text-xl ml-5">{{ currentReward.glob ? '全匹配' : '部分匹配' }}</p>
          </div>
        </template>
        <span v-else>发送任意弹幕均可参与</span>
      </template>
      <template v-if="currentReward.type === 2">
        <span>仅限舰长参与</span>
      </template>
      <template v-if="currentReward.type === 3">
        <span>赠送礼物: </span>
        <span class=" text-blue-400 mr-2">{{ getGiftName(currentReward.gift?.id || 0) }}</span>
        <span>数量不少于 {{ currentReward.gift?.count }} 个</span>
      </template>
    </div>
    <div class=" pt-5 ml-5 flex">
      <div class="flex-1">
        <span>抽取人数：</span>
        <span>{{ currentReward.member }}</span>
      </div>
      <span class="button text-xl mr-5" @click="$emit('setting')">
        设置
      </span>
    </div>
    <div class="pb-5 moni:pb-0 pt-5 ml-5 text-lg font-light">
      参与方式：{{ tips }}
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useGift, useRewardConfig } from '../hooks'

export default defineComponent({
  emits: ['setting'],
  setup() {
    const { currentReward } = useRewardConfig()
    const { getGiftName } = useGift()

    const tips = computed(() => {
      return ['', '发送弹幕口令即可参与抽奖', '仅限舰长参与抽奖', '赠送相应数量的礼物即可参与抽奖'][currentReward.value.type || 0]
    })

    return {
      currentReward,
      tips,
      getGiftName
    }
  }
})
</script>
