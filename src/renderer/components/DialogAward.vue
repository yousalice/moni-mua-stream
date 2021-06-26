<template>
  <DialogLayout title="获奖统计" :show="show">
    <div class="text-right pr-4 pb-4 pt-4">
      <span class="button small" @click="clearAward">清空</span>
    </div>
    <div class="flex text-xl pl-4 pr-4 pb-2 border-b moni:border-b-2 mb-4 border-gray-300">
      <span class="text-center w-52">姓名</span>
      <span class="flex-1">奖励</span>
      <span class="text-center w-36 mr-16">时间</span>
    </div>
    <div
      v-for="(award, index) in computedAwardList"
      :key="award.uid + '-' + index"
      class="flex text-lg ml-4 mr-4 pb-2 mb-2 border-b border-gray-300 moni:border-gray-400 group"
    >
      <span class="w-52 pr-2">{{ award.name }}</span>
      <span class="flex-1 pr-2">{{ award.reward }}</span>
      <span class="w-36">{{ award.time }}</span>
      <span class="pl-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" @click="removeAward(index)">删除</span>
    </div>
  </DialogLayout>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import DialogLayout from './DialogLayout.vue'
import { useAward } from '/@/hooks'
import format from 'date-fns/format'

export default defineComponent({
  components: { DialogLayout },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { awardList, removeAward, clearAward } = useAward()
    const computedAwardList = computed(() => {
      return awardList.value.map((award) => {
        return {
          ...award,
          time: format(award.time || Date.now(), 'yyyy-MM-dd HH:mm')
        }
      })
    })

    return {
      computedAwardList,
      removeAward,
      clearAward
    }
  }
})
</script>
