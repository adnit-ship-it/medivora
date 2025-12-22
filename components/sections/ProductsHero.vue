<template>
  <UiSectionContainer class="mb-20 bg-white " >
    <img
      v-if="sectionData?.logo?.show !== false"
      v-motion
      :initial="{ opacity: 0, y: 100 }"
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
      :src="logoUrl || sectionData?.logo?.src"
      :alt="sectionData?.logo?.alt || `${organizationName || 'Brand'} Logo`"
      class="w-auto h-[32px] md:h-[64px] object-cover"
    />

    <h1
      v-if="sectionData?.heading?.show !== false"
      v-motion
      :initial="{ opacity: 0, y: 100 }"
      :visible-once="{
        opacity: 1,
        y: 0,
        transition: {
          duration: 400,
          type: 'ease-in',
          stiffness: 250,
          damping: 25,
          mass: 1,
          delay: 25,
        },
      }"
      :class="[
        'text-[32px] md:text-[48px] font-semibold font-defaultSerif mt-2 md:mt-4 lg:mt-8',
        headingColorClass
      ]"
      :style="headingColorStyle"
    >
      {{ sectionData?.heading?.text || productsPage?.title || "Explore Our Products" }}
    </h1>

    <p
      v-if="sectionData?.subheading?.show !== false"
      v-motion
      :initial="{ opacity: 0, y: 100 }"
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
      :class="[
        'text-[16px] md:text-[23px] font-extralight mt-2',
        subheadingColorClass
      ]"
      :style="subheadingColorStyle"
    >
      {{ sectionData?.subheading?.text || productsPage?.subtitle || "Personalized GLP-1 Medication" }}
    </p>

    <div class="h-4 md:h-8"></div>

    <div class="flex gap-4 flex-wrap">
      <!-- Always show "All" button -->
      <UiButton
        @click="updateCategory('all')"
        :ghost="selectedCategory !== 'all'"
        v-motion
        :initial="{ opacity: 0, y: 100 }"
        :visible-once="{
          opacity: 1,
          y: 0,
          transition: {
            duration: 400,
            type: 'ease-in',
            stiffness: 250,
            damping: 25,
            mass: 1,
            delay: 75,
          },
        }"
        :width="buttonWidth"
        :height="buttonHeight"
        :font-size="buttonFontSize"
      >
        All
      </UiButton>

      <!-- Dynamically render category buttons only for categories that have products -->
      <UiButton
        v-for="(category, index) in availableCategories"
        :key="category"
        @click="updateCategory(category)"
        :ghost="selectedCategory !== category"
        v-motion
        :initial="{ opacity: 0, y: 100 }"
        :visible-once="{
          opacity: 1,
          y: 0,
          transition: {
            duration: 400,
            type: 'ease-in',
            stiffness: 250,
            damping: 25,
            mass: 1,
            delay: 75 + index * 25,
          },
        }"
        :width="buttonWidth"
        :height="buttonHeight"
        :font-size="buttonFontSize"
      >
        {{ categoryLabels[category] || category }}
      </UiButton>
    </div>
  </UiSectionContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useBrandLogos } from "~/utils/branding";
import { useColors } from "~/composables/useColors";
import { categoryLabels } from "~/data/intake-form/products";
import type { ExtractedSectionData } from "~/utils/sectionDataExtractor";

const props = defineProps<{
  productsPage?: any
  availableCategories?: any[]
  selectedCategory?: string
  sectionData?: ExtractedSectionData | null
}>()

const emit = defineEmits(["update:selectedCategory"]);

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

// Mobile detection (for button sizing)
const isMobile = ref(false);

const checkMobile = () => {
  if (process.client) {
    isMobile.value = window.innerWidth <= 768;
  }
};

onMounted(() => {
  checkMobile();
  if (process.client) {
    window.addEventListener("resize", checkMobile);
  }
});

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener("resize", checkMobile);
  }
});

// Derived button sizes
const buttonWidth = computed(() => (isMobile.value ? "144px" : "320px"));
const buttonHeight = computed(() => (isMobile.value ? "20px" : "44px"));
const buttonFontSize = computed(() => (isMobile.value ? "12" : "24"));

const updateCategory = (category: string) => {
  emit("update:selectedCategory", category);
};
</script>

<style scoped>
/* Products hero section styles */
</style>


