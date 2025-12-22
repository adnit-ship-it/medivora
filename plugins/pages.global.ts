import { usePagesStore } from '~/stores/pagesStore'

export default defineNuxtPlugin(async () => {
  const pagesStore = usePagesStore()

  // Load pages.json and sections.json before app initialization
  // This ensures data is available on both SSR and client before components mount
  if (!pagesStore.pages || !pagesStore.sections) {
    try {
      await pagesStore.loadAll()
    } catch (err) {
      console.error('Failed to load pages/sections data in plugin:', err)
      // Don't throw - let the app continue, components will handle missing data
    }
  }
})

