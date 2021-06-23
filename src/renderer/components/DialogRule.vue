<template>
  <DialogLayout title="使用说明" :show="show">
    <h3 class="text-center">使用说明</h3>
    <section class="p-4 text-xl leading-relaxed">
      <p>
        当前版本的抽奖机提供了灵活的抽奖配置。<span class="text-yellow-400">沫霓</span> 可以通过点击<span class="text-blue-400">配置</span>按钮即可 新增/修改/删除 配置。
      </p>
      <p>
        支持配置 奖励内容（不建议实物奖励）、参与方式、获奖人数，弹幕口令等。
      </p>
      <p>
        推荐奖励内容： <span class="text-red-400">MUA</span>、<span class="text-red-400">嘬螺蛳</span>、<span class="text-red-400">撒娇</span>、  <span class="text-red-400 line-through">禁言套餐</span>、<span class="text-red-400 line-through">抽两个组CP吃席</span>
      </p>
      <p class="pt-4">参与方式：</p>
      <ul class="list-decimal pl-6">
        <li>
          <span class="text-blue-400">仅限舰长</span>：仅限舰长参与，舰长会自动导入到报名名单中，可过滤不在线的舰长。
        </li>
        <li>
          <span class="text-blue-400">弹幕口令参与</span>： 可选择通过发送特定的弹幕口令参与，不限制是否是舰长。如果设置的弹幕口令为星号“ <span class="text-red-400">*</span> ”，则表示发送任意弹幕均可参与。
        </li>
        <li>
          <span class="text-blue-400">赠送礼物参与</span>： 可通过赠送特定的礼物参与，礼物数量需要大于等于设定的数量。仅需在报名周期内赠送的累计数量超过即可。
        </li>
      </ul>
      <p class="pt-4">抽奖方式：</p>
      <ul class="list-decimal pl-6">
        <li>
          <span class="text-blue-400">随机抽奖</span>：默认的抽奖方式。<span class="text-yellow-400">沫霓</span>直接点击 <span class="text-blue-400">开始抽奖</span> 按钮即可开始抽奖，再次点击<span class="text-blue-400">结束抽奖</span> 即可完成抽奖流程，最终显示的名字为获奖人名字。
        </li>
        <li>
          <p><span class="text-blue-400">漏斗式抽奖</span>： 漏斗式抽奖通过多次筛选的方式，从报名名单中，最多不超过4次，不少于1次进行筛选，每次筛选时间2秒，有系统内部快速随机筛选。<span class="text-yellow-400">沫霓</span>需要多次点击 <span class="text-yellow-400">抽奖按钮</span>进行抽取，每次按钮会根据筛选进度显示不同的文案说明。</p>
          <p>比如，当前有30人参与，抽1人，则抽取规律为 先30人中筛9人，再从9人中筛6人，从6人中筛3人，最后从3人中筛1人，即为最终获奖人。此玩法比较紧张刺激，建议多使用。</p>
          <p>算法会根据参与人数与抽取人数，计算合适的筛选次数和每次筛选人数。</p>
        </li>
      </ul>
      <p class="pt-4">随机抽奖算法说明：</p>
      <p class="pl-4">
        抽奖算法引入了权重的计算方式。<br> 权重越高，概率越高。<br> 默认参与人的权重为30。<br>
        被抽中后，会减少后续被抽中的概率，权重减少为8。<br>
        在漏斗式抽奖模式中，仅首次筛选时会根据权重计算名单，后续的筛选恢复为平均筛选。
      </p>
      <p class="pt-4">刀了榜说明：</p>
      <p class="pl-4">统计每个人的抽中次数。 抽中次数会影响后续被抽中的概率。抽中次数过多建议对其解剖研究。</p>
      <p class="pt-4">礼物统计说明：</p>
      <p class="pl-4">统计每个人的获得的礼物。 </p>
      <p class="pt-4">黑名单说明：</p>
      <p class="pl-4">黑名单上的人，即使报名也不会参与到抽奖过程中。</p>
      <p class="pt-4">软件说明：</p>
      <p class="pl-4">本软件仅提供给<span class="text-yellow-400">沫霓</span>在直播过程中使用，以及个人在私下中测试使用。</p>
      <p class="pl-4">本软件由 <span class="text-blue-400 cursor-pointer" @click="onOpen">@yousalice</span> 开发。</p>
    </section>
  </DialogLayout>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useShell } from '../hooks'
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
    const shell = useShell()

    const onOpen = () => {
      shell.openExternal('https://space.bilibili.com/14706910')
    }
    return { onOpen }
  }
})
</script>
