<template>
  <DialogLayout title="刀了榜" :show="show">
    <div class="text-right pt-2 pr-4">
      <span class="button small" @click="clearRank">清空</span>
    </div>
    <div class="flex pl-4 pr-4 pb-2 border-b border-gray-300 moni:border-b-2 mb-4 moni:border-gray-400 text-2xl">
      <span class="flex-1">姓名</span>
      <span class="w-32 pr-4">次数</span>
      <span class="block w-28 h-1"></span>
    </div>
    <div
      v-for="rank in rankList"
      :key="rank.uid"
      class="flex ml-4 mr-4 pt-1 pb-2 mb-2 text-xl border-b moni:border-none group"
    >
      <span class="flex-1 pr-4">{{ rank.name }}</span>
      <span class="w-32 pr-4">{{ rank.count || 0 }}</span>
      <span class="opacity-0 pr-4 group-hover:opacity-100 transition-opacity cursor-pointer text-gray-400" @click="removeRank(rank.uid)">删除</span>
      <span class="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-gray-400" @click="addBlack(rank)">拉黑</span>
    </div>
  </DialogLayout>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useBlack, useRankList } from '../hooks'
import DialogLayout from './DialogLayout.vue'

export default defineComponent({
  components: { DialogLayout },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { rankList, clearRank, removeRank } = useRankList()
    const { addBlack } = useBlack()
    return {
      rankList,
      clearRank,
      addBlack,
      removeRank
    }
  }
})
</script>
