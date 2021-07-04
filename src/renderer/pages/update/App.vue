<template >
  <div class="app p-5">
    <p>当前版本：{{ version }}</p>
    <div v-if="lastVersion">
      <p>最新版本：{{ lastVersion.version }}</p>
      <p>更新时间：{{ lastVersion.date }}</p>
      <p v-if="hasNewVersion" class="text-red-500">有新的版本</p>
    </div>
    <div class="flex justify-around mt-5">
      <p class="button" @click="onCheckUpdate">检查更新</p>
      <p class="button" v-if="hasNewVersion && !isDownloaded" @click="onDownload">立即升级</p>
      <p class="button" v-if="isDownloaded" @click="onInstall">现在安装</p>
    </div>
    <div class="mt-5"  v-if="startDownload">
      <div class="w-full bg-gray-300 h-3 rounded-md overflow-hidden">
        <div class="h-3 rounded-md" :class="isDownloaded ? 'bg-green-400' : 'bg-blue-400'" :style="{ width: assets.percent }"></div>
      </div>
      <p class="mt-2">{{ assets.current }} / {{ assets.total }}</p>
    </div>
    <p v-if="isDownloaded">下载完成, 请点击 安装 按钮进行安装。</p>
  </div>
</template>

<script lang=ts>
import { defineComponent, ref } from 'vue'
import { useService, useIpc } from '/@/hooks'
import format from 'date-fns/format'

export default defineComponent({
  setup() {
    const updater = useService('UpdaterBrowserService')
    const ipc = useIpc()

    const version = ref('0')
    const lastVersion = ref<{ version: string; date: string; notes: string } | null>(null)
    const hasNewVersion = ref(false)
    const startDownload = ref(false)

    const onDownload = () => {
      startDownload.value = true
      updater.download()
    }

    const onCheckUpdate = () => {
      updater.check()
    }

    updater.check()

    const onInstall = () => {
      updater.install()
    }

    ipc.on('update:current-version', (_e, v) => {
      version.value = v
    })

    ipc.on('update:last-version', (_e, info) => {
      lastVersion.value = {
        ...info,
        date: info.date ? format(new Date(info.date), 'yyyy-MM-dd HH:mm') : ''
      }
    })

    ipc.on('update:message', (_e, { code }) => {
      hasNewVersion.value = code === 1
    })

    const assets = ref({ total: '0MB', current: '0MB', percent: '0%' })
    const isDownloaded = ref(false)
    const mb = 1 * 1024 * 1024
    ipc.on('update:downloading', (_e, { total, transferred, percent }) => {
      assets.value = {
        total: (total / mb).toFixed(2) + 'MB',
        current: transferred < mb ? ((transferred / 1024).toFixed(2) + 'KB') : ((transferred / mb).toFixed(2) + 'MB'),
        percent: (percent || 0).toFixed(2) + '%'
      }
      isDownloaded.value = total <= transferred
    })

    ipc.on('update:downloaded', () => {
      isDownloaded.value = true
      assets.value.percent = '100%'
    })

    return {
      onCheckUpdate,
      onDownload,
      onInstall,
      version,
      lastVersion,
      hasNewVersion,
      startDownload,
      assets,
      isDownloaded
    }
  }
})
</script>

<style lang="postcss">
.region {
  -webkit-app-region: drag;
}

.button {
  @apply pt-2 pb-2 pl-5 pr-5 bg-blue-500 text-white rounded-md cursor-pointer select-none transition-colors;
  @apply hover:bg-blue-600
}

</style>
