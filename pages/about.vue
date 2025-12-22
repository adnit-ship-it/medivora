<script setup lang="ts">
import { computed } from 'vue'
import { usePagesStore } from '~/stores/pagesStore'

const pagesStore = usePagesStore()

// Ensure pages + sections are loaded before rendering
await pagesStore.loadAll()

// All visible sections for the "about" page, sorted by order
const aboutSections = computed(() => pagesStore.getPageSections('about'))
</script>

<template>
  <div class="bg-backgroundColor py-24 md:py-32">
    <template v-for="section in aboutSections" :key="section?.name">
      <DynamicSection
        v-if="section && section.show !== false"
        :section="section"
      />
    </template>
  </div>
</template>

<style scoped>
/* About page styles */
</style>