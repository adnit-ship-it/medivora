// Component registry for dynamic section rendering
// Direct imports ensure components are available during SSR

import SectionsHero from '~/components/sections/Hero.vue'
import SectionsDiscover from '~/components/sections/Discover.vue'
import SectionsTrustedBy from '~/components/sections/TrustedBy.vue'
import SectionsJourney from '~/components/sections/Journey.vue'
import SectionsCTA from '~/components/sections/CTA.vue'
import SectionsBeforeAfter from '~/components/sections/BeforeAfter.vue'
import SectionsIntakeForm from '~/components/sections/IntakeForm.vue'
import SectionsAboutBanner from '~/components/sections/AboutBanner.vue'
import SectionsAboutPriority from '~/components/sections/AboutPriority.vue'
import SectionsReviews from '~/components/sections/Reviews.vue'
import SectionsStatistics from '~/components/sections/Statistics.vue'
import SectionsProductsHero from '~/components/sections/ProductsHero.vue'
import SectionsContactHero from '~/components/sections/ContactHero.vue'

// Map component names to actual component references
export const SECTION_COMPONENTS: Record<string, any> = {
  SectionsHero,
  SectionsDiscover,
  SectionsTrustedBy,
  SectionsJourney,
  SectionsCTA,
  SectionsBeforeAfter,
  SectionsIntakeForm,
  SectionsAboutBanner,
  SectionsAboutPriority,
  SectionsReviews,
  SectionsStatistics,
  SectionsProductsHero,
  SectionsContactHero,
}

// Helper function to get component by name
export function getSectionComponent(componentName: string | null): any {
  if (!componentName) return null
  return SECTION_COMPONENTS[componentName] || null
}

