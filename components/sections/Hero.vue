<template>
  <UiSectionWrapper v-if="shouldShowHero" class="relative text-black pt-32 pb-52">
    <!-- Background Image -->
    <div
      class="absolute inset-0 bg-cover bg-no-repeat w-full h-full"
      :style="backgroundStyle"
    />

    <!-- Hand Vial Image - Bottom Right -->
    <div class="absolute bottom-0 right-0 z-20 flex items-end justify-end" :style="foregroundHeightStyle">
      <img
        v-motion
        :initial="{ opacity: 0, y: 100 }"
        :visible-once="{
        opacity: 1,
        y: 0,
        transition: {
          duration: 500,
          type: 'ease-in',
          stiffness: 250,
          damping: 25,
          mass: 1,
        },
      }"
        :src="sectionData?.media?.foreground?.src || '/assets/images/brand/hero-img.png'"
        :alt="sectionData?.media?.foreground?.alt || 'Hand holding vial'"
        class="h-full w-auto object-contain"
      />
    </div>

    <!-- Content - Single Column -->
    <UiSectionContainer class="relative z-30 h-full">
      <div class="space-y-2 md:space-y-4 lg:space-y-10 flex flex-col h-full">
        <div :style="logoWidthStyle">
          <img
            v-motion
            :initial="{ opacity: 0, y: 100 }"
            :visible-once="{
            opacity: 1,
            y: 0,
            transition: {
              duration: 500,
              type: 'ease-in',
              stiffness: 250,
              damping: 25,
              mass: 1,
            },
          }" 
            :src="logoUrl || sectionData?.logo?.src || '/assets/images/brand/logo-primary-1.svg'"
            :style="logoHeightStyle"
            class="w-full object-cover" 
            :alt="sectionData?.logo?.alt || `${organizationName || 'Brand'} Logo`" 
          />
        </div>
        
        <h1 v-motion :initial="{ opacity: 0, y: 100 }" :visible-once="{
          opacity: 1,
          y: 0,
          transition: {
            duration: 500,
            type: 'ease-in',
            stiffness: 250,
            damping: 25,
            mass: 1,
            delay: 50,
          },
        }" :class="[
    'text-2xl md:text-3xl lg:text-[48px] font-bold font-defaultSerif',
    headingColorClass
  ]" :style="headingColorStyle">
          {{ sectionData?.heading?.text }}
        </h1>

        <h2 v-motion :initial="{ opacity: 0, y: 100 }" :visible-once="{
          opacity: 1,
          y: 0,
          transition: {
            duration: 500,
            type: 'ease-in',
            stiffness: 250,
            damping: 25,
            mass: 1,
            delay: 100,
          },
        }" :class="[
    'text-lg md:text-xl lg:text-[34px]',
    subheadingColorClass
  ]" :style="subheadingColorStyle">
          {{ sectionData?.subheading?.text || 'Start your journey with us today!' }}
        </h2>
        
        <!-- Bullet Points -->
        <ul class="space-y-3">
          <li 
            v-for="(bullet, index) in bulletPoints" 
            :key="`bullet-${index}`"
            v-motion 
            :initial="{ opacity: 0, y: 100 }" 
            :visible-once="{
              opacity: 1,
              y: 0,
              transition: {
                duration: 500,
                type: 'ease-in',
                stiffness: 250,
                damping: 25,
                mass: 1,
                delay: 150 + (index * 50),
              },
            }" 
            class="flex items-center h-[10px] md:h-[26px]"
          >
            <UiIcon
              :src="bullet.iconSrc || '/assets/images/brand/check.svg'"
              :alt="`${bullet.text} icon`"  
              :icon-color="resolveIconColor(bullet.iconColor)"
              size="w-[10px] h-[10px] md:w-[26px] md:h-[26px]"
              class="mr-1 md:mr-3" />
            <span class="text-[14px] md:text-[20px] lg:text-[24px] font-medium">{{ bullet.text }}</span>
          </li>
        </ul>

        <!-- CTA Button -->
        <div v-motion :initial="{ opacity: 0, y: 100 }" :visible-once="{
          opacity: 1,
          y: 0,
          transition: {
            duration: 500,
            type: 'ease-in',
            stiffness: 250,
            damping: 25,
            mass: 1,
            delay: 200,
          },
        }" class="flex flex-col justify-end h-[50px] mt-7 lg:mt-5">
          <NuxtLink to="/consultation">
            <UiButton :width="buttonWidth" :height="buttonHeight" :font-size="buttonFontSize" ghost>
              {{ sectionData?.ctaButton?.text || 'Take the Assessment' }}
            </UiButton>
          </NuxtLink>
        </div>
      </div>
    </UiSectionContainer>
  </UiSectionWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useBrandLogos } from "~/utils/branding";
import { usePagesStore } from "~/stores/pagesStore";
import { resolveIconColor } from "~/utils/colorTokens";
import type { ExtractedSectionData } from "~/utils/sectionDataExtractor";
import { useColors } from "~/composables/useColors";

const props = defineProps<{
  sectionData?: ExtractedSectionData | null
}>()



const { logoUrl, organizationName } = useBrandLogos();
const pagesStore = usePagesStore();
const { getColorClass, getColorStyle } = useColors();
// Get data from sectionData prop
const sectionData = computed(() => props.sectionData);
const shouldShowHero = computed(() => sectionData.value?.heading?.show !== false);
const iconRegistry = computed(() => pagesStore.getIconRegistry());


const headingColorClass = computed(() => 
  getColorClass(sectionData.value?.heading?.color, 'text')
);
const headingColorStyle = computed(() => 
  getColorStyle(sectionData.value?.heading?.color)
);

const subheadingColorClass = computed(() => 
  getColorClass(sectionData.value?.subheading?.color, 'text')
);
const subheadingColorStyle = computed(() => 
  getColorStyle(sectionData.value?.subheading?.color)
);
// Transform bulletPoints from sections.json structure to component structure
const bulletPoints = computed(() => {
  const bp = sectionData.value?.bulletPoints;
  if (!bp || !bp.items) return [];
  
  return bp.items.map((text: string) => ({
    text,
    iconSrc: bp.icon?.src,
    iconColor: bp.icon?.color
  }));
});

const backgroundStyle = computed(() => {
  const background = sectionData.value?.media?.background?.src;
  return background
    ? {
        backgroundImage: `url(${background})`,
        backgroundPosition: "bottom right"
      }
    : {
        backgroundImage: "url('/assets/images/brand/hero-bg.png')",
        backgroundPosition: "bottom right"
      };
});

// Mobile/Tablet detection - use refs that get updated on resize
const isMobile = ref(false);
const isTablet = ref(false);

// Check mobile/tablet and update refs
const checkMobile = () => {
  if (!process.client) return;
  const width = window.innerWidth;
  isMobile.value = width <= 768;
  isTablet.value = width > 768 && width <= 1024;
};

console.log('sectionData?.logo?.src', sectionData?.value?.logo?.src)


// Dynamic heights - from sectionData
// Check window size directly in computed for immediate correctness
const foregroundHeightStyle = computed(() => {
  const sizes = sectionData.value?.media?.foreground?.sizes;
  if (!sizes) return {};
  
  // Check window size directly for immediate correctness on initial render
  let currentIsMobile = isMobile.value;
  let currentIsTablet = isTablet.value;
  
  if (process.client) {
    const width = window.innerWidth;
    currentIsMobile = width <= 768;
    currentIsTablet = width > 768 && width <= 1024;
  }
  
  return {
    height: currentIsMobile ? sizes.mobile : currentIsTablet ? sizes.tablet : sizes.desktop
  };
});

const logoHeightStyle = computed(() => {
  const sizes = sectionData.value?.logo?.sizes;
  if (!sizes) return {};
  
  // Check window size directly for immediate correctness on initial render
  let currentIsMobile = isMobile.value;
  let currentIsTablet = isTablet.value;
  
  if (process.client) {
    const width = window.innerWidth;
    currentIsMobile = width <= 768;
    currentIsTablet = width > 768 && width <= 1024;
  }
  
  return {
    height: currentIsMobile ? sizes.mobile : currentIsTablet ? sizes.tablet : sizes.desktop
  };
});

const logoWidthStyle = computed(() => {
  // Check window size directly for immediate correctness
  const currentIsMobile = process.client 
    ? window.innerWidth <= 768 
    : isMobile.value;
  return { width: currentIsMobile ? '150px' : '365px' };
});

onMounted(() => {
  checkMobile(); // Update refs for reactivity on resize
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

// Derived button sizes
const buttonWidth = computed(() => (isMobile.value ? "144px" : "320px"));
const buttonHeight = computed(() => (isMobile.value ? "20px" : "48px"));
const buttonFontSize = computed(() => (isMobile.value ? "12" : "24"));
</script>

<style scoped>
/* Custom styles if needed */
</style>
