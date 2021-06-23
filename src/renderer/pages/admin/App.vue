<template >
  <div class="app relative">
    <div class="region absolute h-7 top-0 left-0 z-10"></div>
    <h1 class="top-title">
      朝海沫霓Moni @yousalice
    </h1>
    <span class=" block el-icon-close absolute right-2 top-1 text-base z-50 cursor-pointer" @click="onClose"></span>
    <router-view class="app-container"> </router-view>
  </div>
</template>

<script lang=ts>
import { defineComponent } from 'vue'
import { useService } from '/@/hooks'

export default defineComponent({
  setup() {
    const onClose = () => {
      console.log(111)
      const admin = useService('AdminBrowserService')
      admin.close()
    }

    return {
      onClose
    }
  }
})
</script>

<style>
.region {
  -webkit-app-region: drag;
  user-select: none;
  width: calc(100vw - 30px);
}

.top-title {
  @apply absolute top-0 left-5 h-7 leading-7 text-gray-300 text-xl z-10;
  text-shadow: 0 -1px 1px #000;
}
.app-container {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100vh;
  background-image: linear-gradient(135deg, #546e61 5%, #344940 45%, #344940 65%, #10201d);
  border: solid 20px transparent;
  border-top: solid 30px transparent;
  border-image: radial-gradient(#b78864 60%, #ac7245 97%, #a35c25) 20 20;
  padding: 5px;
  box-shadow: inset 0 2px 5px 0 rgba(0, 0, 0, 0.4);
  @apply text-3xl;
}
</style>
