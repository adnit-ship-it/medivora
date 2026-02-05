import { usePagesStore } from '~/stores/pagesStore'
import { useLegalStore } from '~/stores/legalStore'

export default defineNuxtPlugin(async () => {
  const pagesStore = usePagesStore()
  const legalStore = useLegalStore()

  // Load pages.json, sections.json, and legal.json before app initialization
  // This ensures data is available on both SSR and client before components mount
  try {
    await Promise.all([
      pagesStore.pages && pagesStore.sections ? Promise.resolve() : pagesStore.loadAll(),
      legalStore.legalData ? Promise.resolve() : legalStore.loadLegal(true)
    ])
  } catch (err) {
    console.error('Failed to load data in plugin:', err)
    // Don't throw - let the app continue, components will handle missing data
  }
})

