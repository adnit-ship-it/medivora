<template>
  <UiSectionWrapper v-if="shouldShowCTA" class="py-20 relative bg-accentColor2 text-bodyColor">
    <UiSectionContainer class="flex md:flex-row-reverse pb-8 md:pb-0">
      <div v-if="sectionData?.media?.product?.src" class="absolute md:relative bottom-0 right-0 z-20 pb-4 md:pb-0 pr-2 md:pr-0 md:h-full" :style="productHeightStyle">
        <img :src="sectionData.media.product.src" :alt="sectionData.media.product.alt || 'cta image'"
          class="h-full w-full object-contain scale-100 md:scale-125" />
      </div>

      <div class="relative z-30 w-full h-full">
        <div class="flex flex-col h-full">
          <h2 v-motion :initial="{ opacity: 0, y: 32 }" :visible-once="{
            opacity: 1,
            y: 0,
            transition: {
              duration: 400,
              type: 'ease-in',
              stiffness: 250,
              damping: 25,
              mass: 1,
              delay: 100,
            },
          }" v-if="sectionData?.heading?.show !== false" :class="['font-semibold text-[20px] md:text-[28px] lg:text-[32px] font-defaultSerif', getColorClass(sectionData?.heading?.color)]" :style="getColorStyle(sectionData?.heading?.color)">
            {{ sectionData?.heading?.text }}
          </h2>
          <p v-if="sectionData?.subheading?.show"
          :class="['pt-5 text-[16px] md:text-[20px] lg:text-[28px] font-regular', getColorClass(sectionData?.subheading?.color)]"
          :style="getColorStyle(sectionData?.subheading?.color)"
          v-motion :initial="{ opacity: 0, y: 32 }" :visible-once="{
            opacity: 1,
            y: 0,
            transition: {
              duration: 400,
              type: 'ease-in',
              stiffness: 250,
              damping: 25,
              mass: 1,
              delay: 150,
            },
          }">
            {{ sectionData.subheading.text }}
          </p>

          <div class="flex flex-col lg:flex-row gap-2 lg:gap-7 pt-4 lg:pt-5">
            <UiButton 
              v-for="(button, index) in visibleButtons" 
              :key="`button-${index}`"
              v-motion 
              :initial="{ opacity: 0, y: 32 }" 
              :visible-once="{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 400,
                  type: 'ease-in',
                  stiffness: 250,
                  damping: 25,
                  mass: 1,
                  delay: 200 + (index * 50),
                },
              }" 
              ghost 
              decorative 
              :width="isMobile ? '145px' : '320px'" 
              :height="isMobile ? '24px' : '44px'"
              :font-size="isMobile ? '12' : '24'"
              :color="getColorClass(button.color)"
              :backgroundColor="getColorClass(button.backgroundColor)"
            >
              {{ button.text }}
            </UiButton>
          </div>

          <div v-if="props.sectionData?.bulletPoints?.show" class="pt-7 lg:pt-[50px] flex flex-wrap gap-4 lg:gap-6 font-medium">
            <div 
              v-for="(feature, index) in features" 
              :key="`feature-${index}`"
              v-motion 
              :initial="{ opacity: 0, y: 32 }" 
              :visible-once="{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 400,
                  type: 'ease-in',
                  stiffness: 250,
                  damping: 25,
                  mass: 1,
                  delay: 300 + (index * 50),
                },
              }" 
              class="flex gap-1 items-center text-[12px] md:text-[20px] lg:text-[24px] font-medium"
            >
              <UiIcon 
                v-if="feature.iconSrc"
                :src="feature.iconSrc" 
                :alt="`${feature.text} icon`"
                :icon-color="feature.iconColor ? resolveIconColor(feature.iconColor) : undefined"
                size="w-[18px] h-[18px] md:w-[24px] md:h-[24px] lg:w-[28px] lg:h-[28px]" />
              <p>{{ feature.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </UiSectionContainer>
  </UiSectionWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { usePagesStore } from "~/stores/pagesStore";
import { useColors } from "~/composables/useColors";
import { resolveIconColor } from "~/utils/colorTokens";
import type { ExtractedSectionData } from "~/utils/sectionDataExtractor";

const props = defineProps<{
  sectionData?: ExtractedSectionData | null
}>()

const pagesStore = usePagesStore();
const { getColorClass, getColorStyle } = useColors();


// Validation: Ensure required data exists - no fallbacks
const hasRequiredData = computed(() => {
  if (!props.sectionData) {
    if (import.meta.dev) {
      console.warn('[CTA] sectionData is missing');
    }
    return false;
  }
  if (!props.sectionData.heading?.text) {
    if (import.meta.dev) {
      console.warn('[CTA] heading.text is missing in sectionData:', props.sectionData);
    }
    return false;
  }
  return true;
});

const shouldShowCTA = computed(() => {
  if (!hasRequiredData.value) return false;
  return props.sectionData?.heading?.show !== false;
});


// Filter buttons by show property - check explicitly for false
const visibleButtons = computed(() => {
  console.log('props.sectionData?.buttons', props.sectionData?.buttons);
  return  props.sectionData?.buttons?.filter(button => {
    return button.show === true;
  }) || [];
}); 

// Check if bulletPoints should be shown
const shouldShowBulletPoints = computed(() => {
  console.log('shouldShowBulletPoints', props.sectionData?.bulletPoints?.show);
  const bp = props.sectionData?.bulletPoints;
  // Only show if bulletPoints exists AND show is not explicitly false
  return bp && bp.show !== false;
});

// Transform bulletPoints to features format - only if show is not false
const features = computed(() => {
  const bp = props.sectionData?.bulletPoints;
  
  // Check show property first - don't process if show is false
  if (!bp || bp.show === false) {
    return [];
  }
  
  if (!Array.isArray(bp.items) || bp.items.length === 0) {
    return [];
  }
  
  return bp.items.map((text: string) => ({
    text,
    iconSrc: bp.icon?.src,
    iconColor: bp.icon?.color
  }));
});

// Product image height - no fallbacks
const productHeightStyle = computed(() => {
  const product = props.sectionData?.media?.product as any;
  const heights = product?.heights as { mobile?: string; desktop?: string } | undefined;
  


  if (!heights) {
    return {};
  }
  
  const height = isMobile.value ? heights.mobile : heights.desktop;
  return height ? { height } : {};
});

const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});
console.log('houldShowBulletPoints && features.length > 0', shouldShowBulletPoints, features.value, props.sectionData
  
)
</script>

<style scoped>
/* Component styles can be added here */
</style>
