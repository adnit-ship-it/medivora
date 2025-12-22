import { resolveColorToken } from "~/utils/colorTokens";

/**
 * Composable for resolving color tokens to classes and styles
 * Use these functions directly in template :class and :style bindings
 */
export function useColors() {
  /**
   * Gets the Tailwind class for a color token
   * Returns empty string for hex colors (use getColorStyle instead)
   * @param color - Color token (e.g., "bodyColor", "accentColor1") or hex value
   * @param prefix - Tailwind prefix ('text', 'bg', 'border'), defaults to 'text'
   * @returns Tailwind class string (e.g., "text-bodyColor") or empty string for hex colors
   */
  const getColorClass = (
    color: string | null | undefined,
    prefix: 'text' | 'bg' | 'border' = 'text'
  ): string => {
    if (!color) return '';
    const resolved = resolveColorToken(color, prefix);
    // Return class only if it's a Tailwind class (doesn't start with #)
    return resolved && !resolved.startsWith('#') ? resolved : '';
  };

  /**
   * Gets the inline style object for a color token
   * Returns empty object for Tailwind token colors (use getColorClass instead)
   * @param color - Color token or hex value
   * @returns Style object with color property or empty object
   */
  const getColorStyle = (
    color: string | null | undefined
  ): { color?: string } => {
    if (!color) return {};
    const resolved = resolveColorToken(color, 'text');
    // Return style only if it's a hex value (starts with #)
    return resolved && resolved.startsWith('#') ? { color: resolved } : {};
  };

  return {
    getColorClass,
    getColorStyle,
  };
}