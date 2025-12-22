<script setup lang="ts">
import { computed } from 'vue'
import { usePagesStore } from '~/stores/pagesStore'

const pagesStore = usePagesStore()

// Ensure pages + sections are loaded before rendering
await pagesStore.loadAll()

// All visible sections for the "home" page, sorted by order
const homeSections = computed(() => pagesStore.getPageSections('home'))
</script>

<template>
  <div class="pt-[83px] lg:pt-[68px]">
    <template v-for="section in homeSections" :key="section?.name">
      <DynamicSection
        v-if="section && section.show !== false"
        :section="section"
      />
    </template>
  </div>
</template>

<style scoped>
/* Custom styles if needed */
</style>
