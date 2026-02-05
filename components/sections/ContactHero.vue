<template>
  <div class="flex flex-col items-center">
    <img
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
        },
      }"
      :src="logoUrl || '/assets/images/brand/logo-secondary-1.svg'"
      :alt="`${organizationName || 'Brand'} Logo`"
      class="w-auto h-[32px] md:h-[48px] object-cover"
    />

    <h2
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
          delay: 50,
        },
      }"
      class="text-[24px] md:text-[32px] font-semibold text-center mt-6 md:mt-12 px-12"
    >
      {{ displayTitle }}
    </h2>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useBrandLogos } from "~/utils/branding";
import type { ExtractedSectionData } from "~/utils/sectionDataExtractor";

const props = defineProps<{
  title?: string
  sectionData?: ExtractedSectionData | null
}>()

const { logoUrl, organizationName } = useBrandLogos();

const displayTitle = computed(() => props.title || props.sectionData?.heading?.text || 'Contact Us: Fill out the form and hear back from us');
</script>

<style scoped>
/* Contact hero styles */
</style>


