import { resolveIconColor } from './colorTokens'
import { usePagesStore } from '~/stores/pagesStore'

/**
 * Utility function to get icon path from icon registry
 * @param iconType - The icon type key from iconRegistry
 * @param iconRegistry - Optional icon registry object (if not provided, uses pagesStore)
 * @returns The icon path or fallback
 */
export function getIconPath(
  iconType: string | undefined,
  iconRegistry?: Record<string, string> | undefined
): string {
  // If iconRegistry not provided, get it from pagesStore
  if (!iconRegistry) {
    const pagesStore = usePagesStore()
    iconRegistry = pagesStore.getIconRegistry()
  }

  if (!iconType || !iconRegistry) {
    return '/assets/images/brand/check.svg'
  }
  return iconRegistry[iconType] || '/assets/images/brand/check.svg'
}

/**
 * Utility function to get SVG style object for applying colors
 * Resolves Tailwind tokens (accentColor1, accentColor2, bodyColor) to hex values
 * Also handles hex values directly
 * @param color - The color to apply (Tailwind token or hex value)
 * @returns Style object with color property (hex value)
 */
export function getSvgColorStyle(color: string | undefined): { color: string } | {} {
  if (!color) {
    return {}
  }
  // Resolve Tailwind tokens (accentColor1, accentColor2, bodyColor) to hex values
  // Also handles hex values directly
  const resolvedColor = resolveIconColor(color)
  return { color: resolvedColor }
}


