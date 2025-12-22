<template>
  <UiSectionWrapper v-if="shouldShowReviews" class="flex-col py-20">
    <UiSectionContainer>
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
      }" :class="headingColorClass" :style="headingColorStyle" class="pb-[24px] font-defaultSerif text-[20px] md:text-[28px] lg:text-[32px] font-semibold">
        {{ sectionData?.heading?.text || 'What Our Customers Have To Say' }}
      </h2>
    </UiSectionContainer>


    <div class="w-full flex flex-col gap-5 md:gap-8">
      <NuxtMarquee  v-motion :initial="{ opacity: 0, y: 32 }" :visible-once="{
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
      }"  :speed="sectionData?.marqueeSpeed || 50" :autoFill="true" class="flex gap-8">
        <div class="flex gap-5 md:gap-8">
          <div v-for="review in topReviews" :key="`top-${review.name}`"
            class="min-w-[320px] md:min-w-[492px] max-w-[320px] md:max-w-[492px] h-[136px] md:h-[188px] border-accentColor1 border rounded-[16px] md:rounded-[28px] bg-backgroundColor p-2 md:p-4 flex flex-col gap-5 md:gap-8">
            <div class="flex items-center justify-between">
              <div class="flex gap-[6px] items-center">
                <UiIcon 
                  :src="reviewsMedia.avatar?.src" 
                  :alt="reviewsMedia.avatar?.alt" 
                  :icon-color="resolveIconColor(reviewsMedia.avatar?.color)"
                  size="w-[24px] h-[24px] md:w-[32px] md:h-[32px]" />
                <p class="text-accentColor1 text-[16px] md:text-[24px] font-medium">
                  {{ review.name }}
                </p>
              </div>
              <div class="flex gap-1.5 md:gap-3">
                <UiIcon 
                  v-for="star in review.stars" 
                  :key="star" 
                  :src="reviewsMedia.star?.src" 
                  :alt="reviewsMedia.star?.alt"
                  :icon-color="resolveIconColor(reviewsMedia.star?.color)"
                  size="w-[22px] h-[22px] md:w-[28px] md:h-[28px]" />
              </div>
            </div>
            <p class="text-[16px] md:text-[24px] text-center leading-tight px-2"
              style="white-space: normal !important; word-wrap: break-word !important;">
              "{{ review.review }}"
            </p>
          </div>
        </div>
      </NuxtMarquee>

      <NuxtMarquee  v-motion :initial="{ opacity: 0, y: 32 }" :visible-once="{
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
      }"  :speed="sectionData?.marqueeSpeed || 50" :direction="'right'" :autoFill="true" class="flex gap-8">
        <div class="flex gap-5 md:gap-8">
          <div v-for="review in bottomReviews" :key="`bottom-${review.name}`"
            class="min-w-[320px] md:min-w-[492px] max-w-[320px] md:max-w-[492px] h-[136px] md:h-[188px] border-accentColor1 border rounded-[16px] md:rounded-[28px] bg-backgroundColor p-2 md:p-4 flex flex-col gap-5 md:gap-8">
            <div class="flex items-center justify-between">
              <div class="flex gap-[6px] items-center">
                <UiIcon 
                  :src="reviewsMedia.avatar?.src" 
                  :alt="reviewsMedia.avatar?.alt" 
                  :icon-color="resolveIconColor(reviewsMedia.avatar?.color)"
                  size="w-[24px] h-[24px] md:w-[32px] md:h-[32px]" />
                <p class="text-accentColor1 text-[16px] md:text-[24px] font-medium">
                  {{ review.name }}
                </p>
              </div>
              <div class="flex gap-1.5 md:gap-3">
                <UiIcon 
                  v-for="star in review.stars" 
                  :key="star" 
                  :src="reviewsMedia.star?.src" 
                  :alt="reviewsMedia.star?.alt"
                  :icon-color="resolveIconColor(reviewsMedia.star?.color)"
                  size="w-[22px] h-[22px] md:w-[28px] md:h-[28px]" />
              </div>
            </div>
            <p class="text-[16px] md:text-[24px] text-center leading-tight px-2"
              style="white-space: normal !important; word-wrap: break-word !important;">
              "{{ review.review }}"
            </p>
          </div>
        </div>
      </NuxtMarquee>
    </div>
  </UiSectionWrapper>

</template>

<script setup lang="ts">
import { computed } from "vue";
import { resolveIconColor, resolveColorToken } from "~/utils/colorTokens";
import type { ExtractedSectionData } from "~/utils/sectionDataExtractor";

const props = defineProps<{
  sectionData?: ExtractedSectionData | null
}>()

const shouldShowReviews = computed(() => {
  const reviews = props.sectionData?.reviews || [];
  return props.sectionData?.heading?.show !== false && reviews.length > 0;
});

const reviewsList = computed(() => props.sectionData?.reviews || []);
const midpoint = computed(() => Math.ceil(reviewsList.value.length / 2));
const topReviews = computed(() => reviewsList.value.slice(0, midpoint.value));
const bottomReviews = computed(() => reviewsList.value.slice(midpoint.value));

const reviewsMedia = computed(() => ({
  avatar: props.sectionData?.media?.avatar || {
    src: "/assets/images/user.svg",
    alt: "user icon",
    color: "#A75809"
  },
  star: props.sectionData?.media?.star || {
    src: "/assets/images/star.svg",
    alt: "star icon",
    color: "#D3C984"
  },
}));

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
</script>
