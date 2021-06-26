<template>
  <teleport to="body">
    <div class="dialog-layout" :class="{ 'hidden': !show }" @click.self="$emit('close')">
      <div class="container">
        <h1 v-if="title" class="dialog-title">{{ title }}</h1>
        <span class="block el-icon-close absolute right-2 top-0 text-base z-50 cursor-pointer text-gray-600 moni:text-gray-300" @click="$emit('close')"></span>
        <div class="content no-scrollbar">
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DialogLayout',
  props: {
    title: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close']
})
</script>
<style lang="postcss" scoped>
.dialog-layout {
  z-index: 90;
  @apply absolute top-0 left-0 w-full h-full flex transform transition-transform duration-500;
}

.dialog-layout.hidden {
  @apply -translate-y-full;
}

.container {
  @apply relative w-1/2 h-3/4 m-auto rounded-md shadow-2xl overflow-hidden border border-gray-200;
}

.theme-moni .container {
  @apply relative w-1/2 h-3/4 m-auto rounded-md shadow-xl border-none overflow-visible;
}

.dialog-title {
  @apply absolute top-0 left-0 h-8 leading-8 bg-white w-full pl-5 shadow-md text-xl z-10;
}
.theme-moni .dialog-title {
  @apply absolute top-1 left-5 h-7 leading-7 text-gray-300 text-xl z-10 bg-transparent w-auto shadow-none;
  text-shadow: 0 -1px 1px #000;
}

.theme-moni .container::before,
.theme-moni .container::after {
  content: '';
  @apply absolute w-8 h-1/2 -top-1/2 shadow-xl;
  background-image: radial-gradient(#b78864 0%, #ac7245 67%, #a35c25);
}
.theme-moni .container::before {
  @apply left-1/4;
}
.theme-moni  .container::after {
  @apply right-1/4;
}

.content {
  @apply w-full h-full p-1 text-3xl overflow-y-auto bg-gray-50 pt-8;
}
.theme-moni .content {
  background-image: linear-gradient(135deg, #546e61 5%, #344940 45%, #344940 65%, #10201d);
  border: solid 15px transparent;
  border-top: solid 35px transparent;
  border-image: radial-gradient(#b78864 60%, #ac7245 97%, #a35c25) 20 20;
  box-shadow: inset 0 2px 5px 0 rgba(0, 0, 0, 0.4);
}
</style>
