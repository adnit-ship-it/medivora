<template>
  <footer class="bg-accentColor1 flex flex-col items-center pb-4" :style="footerHeightStyle">
    <!-- Main navigation row -->
    <div class="max-w-[1328px] w-full flex items-end justify-between md:justify-center px-4 md:px-8 md:gap-8 flex-1">
      <div class="flex items-center">
        <NuxtLink to="/">
          <div class="pb-1" :style="logoHeightStyle">
            <img 
              :src="footerLogoSrc" 
              :alt="footerLogoAlt" 
              class="h-full w-full" 
            />
          </div>
        </NuxtLink>
      </div>
      <div class="md:block h-[1px] mb-1.5 w-full mx-2 md:mx-5 flex-1 bg-white"></div>

      <!-- Navigation buttons on the right -->
      <div class="flex items-center gap-x-2 md:gap-x-6">
        <!-- Home link always first -->
        <NuxtLink to="/"
          class="text-white text-[14px] md:text-[18px] lg:text-[20px] hover:text-gray-200 transition-colors duration-200">
          {{ navigation?.home || 'Home' }}
        </NuxtLink>
        <!-- Other pages ordered by pages.json order -->
        <NuxtLink
          v-for="page in navigationPages"
          :key="page.key"
          :to="pagesStore.getPageRoute(page.key)"
          class="text-white text-[14px] md:text-[18px] lg:text-[20px] hover:text-gray-200 transition-colors duration-200"
        >
          {{ page.title }}
        </NuxtLink>
      </div>
    </div>

    <!-- Legal links row -->
    <div v-if="legalLinks.length > 0" class="w-full flex justify-center pt-2">
      <div class="flex items-center gap-1 text-white/80 text-[12px] md:text-[14px]">
        <template v-for="(link, index) in legalLinks" :key="link.id">
          <span v-if="index > 0" class="mx-1">|</span>
          <NuxtLink 
            :to="`/legal/${link.slug}`"
            class="hover:text-white transition-colors duration-200"
          >
            {{ link.footerLabel }}
          </NuxtLink>
        </template>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { usePagesStore } from "~/stores/pagesStore";
import { useLegalStore } from "~/stores/legalStore";

const pagesStore = usePagesStore();
const legalStore = useLegalStore();

// Get legal links for footer (filtered by showInFooter, sorted by order)
const legalLinks = computed(() => legalStore.footerLinks);

// Get common config from pagesStore
const common = computed(() => pagesStore.getCommonConfig());
const navigation = computed(() => common.value?.navigation);

// Get navigation pages (home first, then by order)
const navigationPages = computed(() => pagesStore.navigationPages);

// Get common layout for footer heights
const commonLayout = computed(() => pagesStore.getCommonLayout());

// Get footer logo from pages.json
const footerLogoSrc = computed(() => {
  const logoRegistry = pagesStore.pages?.logoRegistry?.secondary;
  return logoRegistry?.path || "/assets/images/brand/logo-alt.svg";
});
const footerLogoAlt = computed(() => common.value?.accessibility?.brandLogo || "Brand logo");

// Mobile detection
const isMobile = ref(false);

const checkMobile = () => {
  if (!process.client) return;
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

// Dynamic heights from common.layout
const footerHeightStyle = computed(() => {
  const heights = commonLayout.value?.footer?.height;
  if (!heights) {
    return { height: isMobile.value ? '64px' : '72px' };
  }
  return {
    height: isMobile.value ? heights.mobile : heights.desktop
  };
});

const logoHeightStyle = computed(() => {
  const logoSizes = pagesStore.pages?.logoSizes?.footer;
  if (!logoSizes) {
    return { height: isMobile.value ? '20px' : '32px' };
  }
  return {
    height: isMobile.value ? logoSizes.height.mobile : logoSizes.height.desktop
  };
});
</script>

<style scoped>
/* Custom styles if needed */
</style>
