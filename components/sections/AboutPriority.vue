<template>
    <UiSectionWrapper class="pt-6 md:pt-2">
        <UiSectionContainer class="flex flex-col items-start">
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
                }" 
                :class="[
                    'text-[20px] md:text-[28px] lg:text-[32px] w-full text-left font-defaultSerif font-semibold',
                    headingColorClass
                ]"
                :style="headingColorStyle">
                    {{ sectionData?.heading?.text }}
            </h2>
            <div class="mt-6 lg:mt-10 flex flex-col md:flex-row gap-4 md:justify-between w-full px-8 lg:px-0">
                <div v-for="(item, index) in bulletPoints?.items || []" :key="`feature-${index}`"
                    v-motion :initial="{ opacity: 0, y: 32 }" :visible-once="{
                        opacity: 1,
                        y: 0,
                        transition: {
                            duration: 400,
                            type: 'ease-in',
                            stiffness: 250,
                            damping: 25,
                            mass: 1,
                            delay: 150 + (index * 50),
                        },
                    }" class="flex flex-row gap-2 items-center">
                    <UiIcon :src="featureIcon.src"
                        :alt="featureIcon.alt"
                        :icon-color="resolveIconColor(featureIcon.color)"
                        size="w-[28px] h-[28px]" />
                    <p class="text-[16px] lg:text-[20px] font-medium">{{ item }}</p>
                </div>
            </div>
            <div
                class="pb-12 lg:pb-0 px-8 lg:px-0 mt-12 lg:mt-16 flex flex-col md:flex-row gap-8 justify-center md:justify-around w-full">
                <div v-motion :initial="{ opacity: 0, y: 32 }" :visible-once="{
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 400,
                        type: 'ease-in',
                        stiffness: 250,
                        damping: 25,
                        mass: 1,
                        delay: 350,
                    },
                }" class="flex flex-col items-center w-full max-w-[400px]">
                    <h3
                        class="text-accentColor1 text-[20px] lg:text-[20px] font-semibold text-left lg:text-center w-full">
                        {{ infoCard?.title }}
                    </h3>
                    <div class="h-0.5 w-10 bg-accentColor1 mt-0"></div>
                    <p class="font-medium mt-4 tracking-tight w-full text-left lg:text-center">
                        {{ infoCard?.description  }}
                    </p>
                </div>
                <div v-motion :initial="{ opacity: 0, y: 32 }" :visible-once="{
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 400,
                        type: 'ease-in',
                        stiffness: 250,
                        damping: 25,
                        mass: 1,
                        delay: 350,
                    },
                }" class="flex flex-col items-center w-full max-w-[400px]">
                    <h3
                        class="text-accentColor1 text-[20px] lg:text-[24px] font-semibold text-left lg:text-center w-full">
                        {{ infoCardWithBulletpoint?.title || 'Hand Selected Providers' }}
                    </h3>
                    <div class="h-0.5 w-10 bg-accentColor1 mt-0"></div>
                    <p class="font-medium mt-4 tracking-tight w-full text-left lg:text-center">
                        {{ infoCardWithBulletpoint?.description || 'Medivora physicians are here to guide you every step of the way, bringing both their expertise and genuine care to keep you supported.' }}
                    </p>
                    <div class="flex flex-row gap-4 w-full justify-start lg:justify-center items-center mt-2">
                        <UiIcon :src="certificationIcon.src"
                            :alt="certificationIcon.alt"
                            :v-if="infoCardWithBulletpoint?.bulletpoints?.[0]?.showIcon"
                            :icon-color="resolveIconColor(certificationIcon.color)"
                            size="w-[28px] h-[28px]" />
                        <p>{{ infoCardWithBulletpoint?.bulletpoints?.[0]?.text }}</p>
                    </div>
                </div>
            </div>
        </UiSectionContainer>
    </UiSectionWrapper>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { resolveIconColor } from "~/utils/colorTokens";
import { useColors } from "~/composables/useColors";
import type { ExtractedSectionData } from "~/utils/sectionDataExtractor";

const props = defineProps<{
  sectionData?: ExtractedSectionData | null
}>()

const { getColorClass, getColorStyle } = useColors();

const shouldShowPriority = computed(() => props.sectionData?.heading?.show !== false);

// Computed properties for dynamic colors
const headingColorClass = computed(() => 
  getColorClass(props.sectionData?.heading?.color, 'text')
);
const headingColorStyle = computed(() => 
  getColorStyle(props.sectionData?.heading?.color)
);

// Get bulletPoints for features
const bulletPoints = computed(() => props.sectionData?.bulletPoints);
const featureIcon = computed(() => {
  const icon = bulletPoints.value?.icon;
  return {
    src: icon?.src || '/assets/images/checkmark-star-brown.svg',
    alt: 'checkmark',
    color: icon?.color
  };
});

// Get infoCard and infoCard with bulletpoint
const infoCard = computed(() => props.sectionData?.infoCard);
const infoCardWithBulletpoint = computed(() => props.sectionData?.['infoCard with bulletpoint']);
const certificationIcon = computed(() => {
  const bulletpointIcon = infoCardWithBulletpoint.value?.bulletpointIcon;
  return {
    src: bulletpointIcon?.src || '/assets/images/checkmark-star.svg',
    alt: 'checkmark',
    color: bulletpointIcon?.color
  };
});
</script>