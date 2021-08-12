<template>
  <DialogLayout title="日志" :show="show">
    <div
      v-for="(log, index) in logList"
      :key="index"
    >
      <template v-if="typeof log === 'string'">
        <p class="text-2xl h-8 pl-4">{{ log }}</p>
        <div v-if="log" class="flex pl-4 pt-2 pr-4 pb-2 border-b moni:border-b-2 mb-4 border-gray-400 text-xl">
          <span class="flex-1">姓名</span>
          <span class="w-12">权重</span>
          <span class="flex-1">随机值</span>
          <span class="flex-1">A-RES</span>
        </div>
      </template>
      <div v-else class="flex ml-4 mr-4 pb-2 text-xl" :class="{ 'text-green-300': log.pick }">
        <span class="flex-1" >{{ log.name }}</span>
        <span class="w-10" >{{ log.weight }}</span>
        <span class="flex-1">{{ log.random }}</span>
        <span class="flex-1">{{ log.aRes }}</span>
      </div>
    </div>
  </DialogLayout>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useLogger } from '../hooks'
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
    const { logList } = useLogger()
    return {
      logList
    }
  }
})
</script>
