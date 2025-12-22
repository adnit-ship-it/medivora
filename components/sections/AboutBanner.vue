<script setup lang="ts">
import { computed } from 'vue';
import { UiSectionWrapper } from '#components';
import { useBrandLogos } from "~/utils/branding";
import { useColors } from "~/composables/useColors";
import type { ExtractedSectionData } from "~/utils/sectionDataExtractor";

const props = defineProps<{
  sectionData?: ExtractedSectionData | null
}>()

const { logoUrl, organizationName } = useBrandLogos();
const { getColorClass, getColorStyle } = useColors();

// Computed properties for dynamic colors
const headingColorClass = computed(() => 
  getColorClass(props.sectionData?.heading?.color, 'text')
);
const headingColorStyle = computed(() => 
  getColorStyle(props.sectionData?.heading?.color)
);

const subheadingColorClass = computed(() => 
  getColorClass(props.sectionData?.subheading?.color, 'text')
);
const subheadingColorStyle = computed(() => 
  getColorStyle(props.sectionData?.subheading?.color)
);

const paragraphColorClass = computed(() => 
  getColorClass(props.sectionData?.paragraph?.color, 'text')
);
const paragraphColorStyle = computed(() => 
  getColorStyle(props.sectionData?.paragraph?.color)
);

</script>

<template>
    <UiSectionWrapper class="py-20">
        <UiSectionContainer>
            <img v-motion :initial="{ opacity: 0, y: 100 }" :visible-once="{
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
                v-if="sectionData?.logo?.show !== false"
                :src="logoUrl || sectionData?.logo?.src " 
                :alt="`${organizationName || 'Brand'} Logo`"
                class="w-auto h-[32px] lg:h-[64px] object-cover" />
            <div class="w-full flex flex-col md:flex-row gap-8 lg:gap-20 items-center mt-6">
                <div class="flex-1 h-full flex flex-col gap-2 lg:gap-6">
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
                    }" v-if="sectionData?.heading?.show !== false" 
                        :class="[
                            'font-semibold font-defaultSerif text-[32px] lg:text-[48px] mb-2 lg:mb-4',
                            headingColorClass
                        ]"
                        :style="headingColorStyle">
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
                    }" v-if="sectionData?.subheading?.show !== false" 
                        :class="[
                            'font-semibold text-[24px] lg:text-[34px]',
                            subheadingColorClass
                        ]"
                        :style="subheadingColorStyle">
                        {{ sectionData?.subheading?.text || 'Quality is our guarantee!' }}
                    </h2>
                    <p v-motion :initial="{ opacity: 0, y: 100 }" :visible-once="{
                        opacity: 1,
                        y: 0,
                        transition: {
                            duration: 500,
                            type: 'ease-in',
                            stiffness: 250,
                            damping: 25,
                            mass: 1,
                            delay: 150,
                        },
                    }" v-if="sectionData?.paragraph?.show !== false" 
                        :class="[
                            'text-[24px] lg:text-[34px] font-light',
                            paragraphColorClass
                        ]"
                        :style="paragraphColorStyle">
                        {{ sectionData?.paragraph?.text || 'Medivora works to change the game in the health and wellness space allowing for certified medical care, made simple and effective.' }}
                    </p>
                </div>
                <div class="w-[240px] lg:w-[384px] h-full">
                    <img v-motion :initial="{ opacity: 0, y: 100 }" :visible-once="{
            opacity: 1,
            y: 0,
            transition: {
              duration: 500,
              type: 'ease-in',
              stiffness: 250,
              damping: 25,
              mass: 1,
              delay: 0,
            },
          }" :src="sectionData?.media?.image?.src || '/assets/images/products-alt.png'"
                        :alt="sectionData?.media?.image?.alt || 'products'"
                        class="w-full h-full object-cover" />
                </div>
            </div>
        </UiSectionContainer>
    </UiSectionWrapper>
</template>