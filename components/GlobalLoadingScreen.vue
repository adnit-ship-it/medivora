<template>
  <Transition enter-active-class="transition-all duration-400 ease-in-out" enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100" leave-active-class="transition-all duration-500 ease-in-out"
    leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="isVisible" class="fixed inset-0 z-[9999] bg-backgroundColor flex flex-col items-center justify-center"
      :class="{ 'pointer-events-none': isFadingOut }">
      <img v-motion :initial="{ opacity: 0, y: 32 }" :visible-once="{
        opacity: 1,
        y: 0,
        transition: {
          duration: 400,
          type: 'ease-in',
          stiffness: 250,
          damping: 25,
          mass: 1,
        },
      }" 
        :src="loadingLogoSrc" 
        :alt="loadingLogoAlt" 
        class="w-auto mb-6" 
        :style="{ height: loadingLogoHeight }" />
      <p class="text-lg text-gray-600 font-medium">{{ loadingText }}</p>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { usePagesStore } from "~/stores/pagesStore";

interface Props {
  isVisible: boolean
  isFadingOut: boolean
}

defineProps<Props>()

const pagesStore = usePagesStore()
const loadingScreen = computed(() => pagesStore.pages?.loadingScreen)
const loadingLogoSrc = computed(() => loadingScreen.value?.logo?.src || '/assets/images/brand/logo-alt.svg')
const loadingLogoAlt = computed(() => loadingScreen.value?.logo?.alt || 'Brand logo')
const loadingText = computed(() => loadingScreen.value?.text || 'Loading...')

const isMobile = ref(false)
const updateIsMobile = () => {
  if (!process.client) return
  isMobile.value = window.innerWidth <= 768
}

const loadingLogoHeight = computed(() => {
  const logoSizes = pagesStore.pages?.logoSizes?.loadingScreen
  if (!logoSizes) return '124px'
  if (isMobile.value) return logoSizes.height.mobile || '124px'
  return logoSizes.height.desktop || '124px'
})

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})
</script>

<style scoped>
/* Ensure the loading screen covers everything */
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
