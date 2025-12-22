<template>
  <UiSectionWrapper class="py-20 flex-col">
    <UiSectionContainer class="pb-6">
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
      }" v-if="sectionData?.heading?.show !== false" :class="headingColorClass" :style="headingColorStyle" class="font-defaultSerif text-[20px] md:text-[28px] lg:text-[32px] font-semibold md:text-left">
        {{ sectionData?.heading?.text }}
      </h2>
    </UiSectionContainer>

    <UiCardCarousel :items="carouselImages">
      <template #default="{ item }">
        <div class="w-full h-full">
          <img :src="item.src" :alt="item.alt" class="h-full w-full object-cover" />
        </div>
      </template>
    </UiCardCarousel>
  </UiSectionWrapper>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { resolveColorToken } from "~/utils/colorTokens";
import type { ExtractedSectionData } from "~/utils/sectionDataExtractor";

const props = defineProps<{
  sectionData?: ExtractedSectionData | null
}>()

const shouldShowBeforeAfter = computed(() => props.sectionData?.heading?.show !== false);

// Heading color
const headingColorClass = computed(() => {
  const color = props.sectionData?.heading?.color;
  if (!color) return 'text-black';
  const resolved = resolveColorToken(color, 'text');
  return resolved && !resolved.startsWith('#') ? resolved : '';
});

const headingColorStyle = computed(() => {
  const color = props.sectionData?.heading?.color;
  if (!color) return {};
  const resolved = resolveColorToken(color, 'text');
  return resolved && resolved.startsWith('#') ? { color: resolved } : {};
});

const carouselImages = computed(() =>
  (props.sectionData?.beforeAfter || []).map((item: any, index: number) => ({
    src: item.image?.src || '',
    alt: item.image?.alt || `Before & After ${index + 1}`,
  }))
);
</script>

<style scoped>
/* Custom styles if needed */
</style>
