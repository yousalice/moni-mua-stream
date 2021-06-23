<template>
  <DialogLayout title="奖励配置" :show="show">
    <div class="flex pt-4 pl-4 items-end">
      <span class="button" @click="createReward = true">添加配置</span>
      <span class="flex-1 text-right mr-4 text-lg">单击即可选择</span>
    </div>
    <div class="m-4 border-t-2 border-gray-400">
      <div class="text-2xl flex items-center pt-4 pb-4 border-b-2 border-gray-400" v-if="createReward">
        <div class="pr-4">
          <span class="el-icon-plus"></span>
        </div>
        <div class="flex-1">
          <p>奖励：<input type="text" class="input" v-model="newReward.name"></p>
          <div class="flex">
            <span>方式：</span>
            <div class="flex-1">
              <p
                v-for="rewardType in rewardTypeList"
                :key="rewardType.value"
                class="cursor-pointer"
                :class="{ 'text-blue-400': newReward.type === rewardType.value }"
                @click="newReward.type = rewardType.value"
              >
                {{ rewardType.label }} <span class="el-icon-check" v-if="newReward.type === rewardType.value"></span>
              </p>
            </div>
          </div>
          <p>人数：<input type="text" class="input" v-model="newReward.member"></p>
          <p v-if="newReward.type === 1" class="pt-2">弹幕：<input type="text" class="input" v-model="newReward.command"></p>
          <div v-if="newReward.type === 3" class="flex">
            <span>礼物：</span>
            <div class="flex-1">
              <p
                v-for="gift in giftList"
                :key="gift.id"
                class="cursor-pointer"
                :class="{ 'text-blue-400': newReward.gift.id === gift.id }"
                @click="newReward.gift.id = gift.id"
              >
                {{ gift.name }} ( ¥ {{ gift.price }} ) <span class="ml-2 el-icon-check" v-if="newReward.gift.id === gift.id"></span>
              </p>
            </div>
          </div>
          <p v-if="newReward.type === 3" class="pt-2">数量：<input type="text" class="input" v-model="newReward.gift.count"></p>
        </div>
        <div>
          <p class="cursor-pointer" @click="submitCreate">确认</p>
          <p class="mt-5 cursor-pointer" @click="cancelCreate">取消</p>
        </div>
      </div>
      <div
        v-for="config in watchRewardList"
        :key="config.reward.id"
        class="text-2xl flex items-center pt-4 pb-4 border-b-2 border-gray-400"
      >
        <p class="pr-4 w-8" @click="!config.edit && setCurrentReward(config.reward.id)">
          <span v-if="currentReward.id === config.reward.id" class="el-icon-circle-check"></span>
        </p>
        <div class="flex-1" @click="!config.edit && setCurrentReward(config.reward.id)">
          <template v-if="!config.edit">
            <p>奖励：{{ config.reward.name }}</p>
            <p>方式：{{ getRewardTypeByValue(config.reward.type) }}</p>
            <p>人数：{{ config.reward.member }}</p>
            <p v-if="config.reward.type === 1">弹幕：{{ config.reward.command }}</p>
            <p v-if="config.reward.type ===3" >
              礼物：{{ getGiftName(config.reward.gift.id) }} X {{ config.reward.gift.count }}
            </p>
          </template>
          <template v-else>
            <p>奖励：<input type="text" class="input" v-model="config.reward.name"></p>
            <div class="flex">
              <span>方式：</span>
              <div>
                <p
                  v-for="rewardType in rewardTypeList"
                  :key="rewardType.value"
                  class="cursor-pointer"
                  :class="{ 'text-blue-400': config.reward.type === rewardType.value }"
                  @click="config.reward.type = rewardType.value"
                >
                  {{ rewardType.label }} <span class="el-icon-check" v-if="config.reward.type === rewardType.value"></span>
                </p>
              </div>
            </div>
            <p>人数：<input type="text" class="input" v-model="config.reward.member"></p>
            <p v-if="config.reward.type === 1" class="pt-2">弹幕：<input type="text" class="input" v-model="config.reward.command"></p>
            <div v-if="config.reward.type === 3" class="flex">
              <span>礼物：</span>
              <div class="flex-1">
                <p
                  v-for="gift in giftList"
                  :key="gift.id"
                  class="cursor-pointer"
                  :class="{ 'text-blue-400': config.reward.gift.id === gift.id }"
                  @click="config.reward.gift.id = gift.id"
                >
                  {{ gift.name }} ( ¥ {{ gift.price }} ) <span class="ml-2 el-icon-check" v-if="config.reward.gift.id === gift.id"></span>
                </p>
              </div>
            </div>
            <p v-if="config.reward.type === 3" class="pt-2">数量：<input type="text" class="input" v-model="config.reward.gift.count"></p>
          </template>
        </div>
        <div class="select-none cursor-pointer">
          <p v-if="!config.edit">
            <span class="block el-icon-edit-outline" @click="config.edit = true"></span>
            <span class="block mt-4 el-icon-remove-outline" @click="removeRewardConfig(config.reward.id)"></span>
          </p>
          <p v-else>
            <span class="block cursor-pointer"  @click="submitToUpdate(config)">确认</span>
            <span class="block mt-4 cursor-pointer" @click="config.edit = false">取消</span>
          </p>
        </div>
      </div>
    </div>
  </DialogLayout>
</template>
<script lang="ts">
import _ from 'lodash'
import { defineComponent, watch, ref } from 'vue'
import DialogLayout from './DialogLayout.vue'
import { RewardOption, useDialog, useGift, useRewardConfig } from '/@/hooks'

type WatchRewardOption = { reward: RewardOption, edit: boolean }

export default defineComponent({
  components: { DialogLayout },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const {
      rewardConfigList,
      currentReward,
      addRewardConfig,
      updateRewardConfig,
      removeRewardConfig,
      rewardTypeList,
      getRewardTypeByValue,
      setCurrentReward
    } = useRewardConfig()
    const { giftList, getGiftName } = useGift()
    const watchRewardList = ref<WatchRewardOption[]>([])

    watch(rewardConfigList, () => {
      watchRewardList.value = rewardConfigList.value.map((reward: RewardOption) => {
        return {
          reward: _.cloneDeep(reward),
          edit: false
        }
      })
    }, { immediate: true, deep: true })

    const submitToUpdate = async (config: WatchRewardOption) => {
      if (config.reward.type === 1 && !config.reward.command) {
        useDialog().showMessageBox({
          title: '提示',
          message: '缺少弹幕口令'
        })
        return
      }
      if (config.reward.type === 3 && (config.reward.gift.id === 0 || Number(config.reward.gift.count) <= 0)) {
        useDialog().showMessageBox({
          title: '提示',
          message: '请选择礼物，礼物数量至少1个'
        })
      }
      await updateRewardConfig(config.reward)
      config.edit = false
    }

    const newReward = ref({
      name: '',
      type: 1,
      command: '',
      member: 1,
      gift: { id: 0, count: 1 }
    })
    const createReward = ref(false)

    const cancelCreate = () => {
      newReward.value = {
        name: '',
        type: 1,
        command: '',
        member: 1,
        gift: { id: 0, count: 1 }
      }
      createReward.value = false
    }

    const submitCreate = async () => {
      const { type, name, gift, command } = newReward.value
      if (!name) return
      if (type === 1 && !command) {
        useDialog().showMessageBox({
          title: '提示',
          message: '缺少弹幕口令'
        })
        return
      }
      if (type === 2 && (gift.id === 0 || Number(gift.count) <= 0)) {
        useDialog().showMessageBox({
          title: '提示',
          message: '请选择礼物，礼物数量至少1个'
        })
      }
      await addRewardConfig(newReward.value)
      cancelCreate()
    }

    return {
      newReward,
      createReward,
      cancelCreate,
      submitCreate,
      currentReward,
      watchRewardList,
      addRewardConfig,
      submitToUpdate,
      removeRewardConfig,
      getRewardTypeByValue,
      rewardTypeList,
      setCurrentReward,
      giftList,
      getGiftName
    }
  }
})
</script>
<style>

</style>
