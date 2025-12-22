<template>
  <div
    :class="[
      'h-[88px] md:h-[128px] w-[276px] md:w-[500px] transition-all duration-300 lg:h-[304px] lg:w-[304px] border-2 rounded-[6px] lg:rounded-[10px] flex flex-row lg:flex-col items-start lg:items-center justify-start lg:justify-center gap-5 px-5 py-2 md:py-4 lg:px-0 lg:py-0',
      isActive ? 'border-accentColor1 bg-accentColor2' : 'border-accentColor1/40 lg:border-accentColor1 lg:bg-accentColor2'
    ]"
  >
    <UiIcon 
      :src="img" 
      :alt="imgAlt || title" 
      :icon-color="resolveIconColor(iconColor)"
      size="h-8 w-8 md:w-[48px] md:h-[48px] lg:w-[60px] lg:h-[60px]"
      class="mt-2 lg:mt-0" />
    <div class="flex justify-center flex-col gap-0.5 lg:gap-5">
      <p class="text-[16px] md:text-[20px] font-semibold text-left lg:text-center">
        {{ title }}
      </p>
      <p class="text-black text-[14px] md:text-[20px] font-medium text-left lg:text-center">
        <span v-html="subtext"></span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { resolveIconColor } from '~/utils/colorTokens'

interface Props {
  img: string
  title: string
  subtext: string
  imgAlt?: string
  isActive?: boolean
  iconColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  imgAlt: undefined,
  isActive: false,
  iconColor: undefined
})
</script> 