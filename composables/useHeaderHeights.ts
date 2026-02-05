import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePagesStore } from '~/stores/pagesStore'

export function useHeaderHeights() {
  const pagesStore = usePagesStore()

  // Breakpoint detection (desktop-first defaults for SSR to match CSS defaults)
  const isMobile = ref(false)
  const isTablet = ref(false)

  // Update breakpoints based on window width
  const updateBreakpoints = () => {
    if (typeof window === 'undefined') return
    const width = window.innerWidth
    isMobile.value = width < 768
    isTablet.value = width >= 768 && width < 1024
  }

  // Get navbar height from common.layout (single source of truth)
  const navbarHeight = computed(() => {
    const commonLayout = pagesStore.getCommonLayout()
    const heights = commonLayout?.navbar?.height

    // Default fallbacks match CSS defaults in main.css
    if (!heights) return isMobile.value ? '83px' : '68px'

    if (isMobile.value) return heights.mobile || '83px'
    return heights.desktop || '68px'
  })

  // Get announcement height (0px if disabled)
  const announcementHeight = computed(() => {
    const announcement = pagesStore.announcement
    if (!announcement?.enabled) return '0px'

    const heights = announcement.heights
    if (!heights) return '0px'

    if (isMobile.value) return heights.mobile || '60px'
    if (isTablet.value) return heights.tablet || '70px'
    return heights.desktop || '80px'
  })

  // Combined header offset
  const headerOffset = computed(() => {
    return `calc(${navbarHeight.value} + ${announcementHeight.value})`
  })

  // CSS variables object for :style binding on root element
  const cssVariables = computed(() => ({
    '--navbar-height': navbarHeight.value,
    '--announcement-height': announcementHeight.value,
    '--header-offset': headerOffset.value
  }))

  // Setup resize listener
  onMounted(() => {
    updateBreakpoints()
    window.addEventListener('resize', updateBreakpoints)
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateBreakpoints)
    }
  })

  return {
    isMobile,
    isTablet,
    navbarHeight,
    announcementHeight,
    headerOffset,
    cssVariables,
    updateBreakpoints
  }
}