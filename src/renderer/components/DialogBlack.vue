<template>
  <DialogLayout title="黑名单" :show="show">
    <div class="text-right pt-2 pr-4">
      <span class="button small" @click="clearBlack">清空</span>
    </div>
    <div class="flex pl-4 pr-4 pb-2 border-b-2 mb-4 border-gray-400">
      <span class="flex-1">姓名</span>
      <span class="block w-28 h-1"></span>
    </div>
    <div
      v-for="black in blackList"
      :key="black.uid"
      class="flex ml-4 mr-4 pb-2 border-b-2 mb-4 border-gray-400 text-2xl"
    >
      <span class="flex-1 pr-4">{{ black.name }}</span>
      <span class="button small" @click="removeBlack(black)">删除</span>
    </div>
  </DialogLayout>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useBlack } from '../hooks'
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
    const { blackList, removeBlack, clearBlack } = useBlack()
    return {
      blackList,
      removeBlack,
      clearBlack
    }
  }
})
</script>
