<template >
  <div class="app relative">
    <h1 class="top-title flex">
      <span class="cursor-pointer select-none" @click="onTitleClick">
        {{ currentVtuber ? currentVtuber.name : 'Chobits-Live' }} @yousalice
      </span>
      <span class="flex-1 region h-8"></span>
      <span class=" w-8 h-8"></span>
    </h1>
    <span class="block el-icon-close absolute right-2 top-1 text-base z-50 cursor-pointer" @click="onClose"></span>
    <router-view class="app-container"> </router-view>
    <div
      v-show="showVtuberSetting"
      class="config absolute left-5 top-10 w-64 z-20 bg-white p-5 shadow-lg border border-gray-200 text-xl max-h-full"
    >
      <div
        v-for="config in chobitsConfigList"
        :key="config.uid"
        class="p-1 border-b border-gray-200 cursor-pointer moni:border-gray-400"
        @click="onCurrentVtuber(config)"
      >{{ config.name }}</div>
    </div>
  </div>
</template>

<script lang=ts>
import { defineComponent, ref, watch, nextTick, onUnmounted, onBeforeMount } from 'vue'
import { useService, useRewardConfig, useRankList, useBlack, useGuardList, useAward, useGift, useChobitsConfig, VtuberOption, useMember, usePlay, useDialog } from '/@/hooks'

export default defineComponent({
  setup() {
    const { initRewardConfig } = useRewardConfig()
    const { initRankList } = useRankList()
    const { initBlackList } = useBlack()
    const { initAwardList } = useAward()
    const { autoRefresh, closeRefresh } = useGuardList()
    const { initGiftList } = useGift()
    const { chobitsConfigList, setCurrentVtuber, currentVtuber, getCurrentVtuber } = useChobitsConfig()
    const { clearMember } = useMember()
    const { isMonitor } = usePlay()
    const { guardList } = useGuardList()
    const service = useService('AdminBrowserService')
    const dialog = useDialog()

    const onClose = () => {
      service.close()
    }

    const isMoni = ref(false)
    const showVtuberSetting = ref(false)
    const onTitleClick = () => {
      if (__IS_MONI__) return
      showVtuberSetting.value = !showVtuberSetting.value
    }

    const moniUid = 1589117610

    const onCurrentVtuber = async ({ uid, roomId, name }: VtuberOption) => {
      setCurrentVtuber({ uid, roomId, name })
      closeRefresh()
      clearMember()
      guardList.value = []
      showVtuberSetting.value = false
      isMoni.value = uid === moniUid
      service.connect({
        mid: uid,
        roomId,
        whiteList: ['all']
      })
      await initRewardConfig()
      await initAwardList()
      await initRankList()
      await initBlackList()
      await initGiftList()
      await autoRefresh({ uid, roomId })
    }

    onBeforeMount(async () => {
      const vtuber = __IS_MONI__ ? { uid: 1589117610, roomId: 23001181, name: '朝海沫霓Moni' } : await getCurrentVtuber()
      if (vtuber) {
        const { uid, roomId } = vtuber
        isMoni.value = uid === moniUid
        service.connect({
          mid: uid,
          roomId,
          whiteList: ['all']
        })
        __IS_MONI__ && await setCurrentVtuber(vtuber)
        await initRewardConfig()
        await initAwardList()
        await initRankList()
        await initBlackList()
        await initGiftList()
        await autoRefresh({ uid, roomId })
      } else {
        showVtuberSetting.value = true
        dialog.showMessageBox({
          title: '提示',
          message: '在左侧主播列表点击选择对应的主播。'
        })
      }
    })
    onUnmounted(() => {
      closeRefresh()
    })

    watch(isMoni, async (isMoni) => {
      await nextTick()
      const body = document.documentElement
      isMoni ? body.classList.add('theme-moni') : body.classList.remove('theme-moni')
    }, { immediate: true })

    return {
      onClose,
      isMoni,
      onTitleClick,
      showVtuberSetting,
      currentVtuber,
      chobitsConfigList,
      onCurrentVtuber
    }
  }
})
</script>

<style lang="postcss">
.region {
  -webkit-app-region: drag;
}

.config::before {
  content: '';
  display: block;
  position: absolute;
  top: -6px;
  left: 30px;
  width: 10px;
  height: 10px;
  transform: rotate(45deg);
  background-color: #fff;
  @apply border-l border-t border-gray-300
}

.theme-moni .config {
  background-image: linear-gradient(135deg, #546e61 5%, #344940 45%, #344940 65%, #10201d);
  border: solid 10px transparent;
  border-top: solid 20px transparent;
  border-image: radial-gradient(#b78864 60%, #ac7245 97%, #a35c25) 20 20;
  box-shadow: inset 0 2px 5px 0 rgba(0, 0, 0, 0.4);
  left: 40px;
}

.theme-moni .config::before {
  display: none;
}

.top-title {
  @apply absolute top-0 left-0 pl-5 h-8 leading-7 text-black text-xl z-10 bg-white shadow-sm w-full;
}
.theme-moni .top-title {
  @apply absolute top-0 left-5 h-7 leading-7 text-gray-300 text-xl z-10 bg-transparent;
  text-shadow: 0 -1px 1px #000;
}

.app-container {
  @apply relative w-full bg-gray-100;
  height: 100vh;
  @apply text-3xl pt-8;
}

.theme-moni .app-container {
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
