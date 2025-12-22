<template>
  <button
    v-if="!props.decorative"
    :class="buttonClasses"
    :style="buttonStyles"
    :disabled="props.disabled || props.loading"
  >
    <slot>{{ props.text }}</slot>
  </button>
  <div v-else :class="buttonClasses" :style="buttonStyles">
    <slot>{{ props.text }}</slot>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { resolveColorToken, resolveBackgroundColor } from "~/utils/colorTokens";

const props = defineProps({
  height: {
    type: String,
    default: "48px",
  },
  width: {
    type: String,
    default: "full",
  },
  fontSize: {
    type: String,
    default: "16",
  },
  ghost: {
    type: Boolean,
    default: false,
  },
  // New props for integration
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: "default",
    validator: (value) =>
      ["default", "ghost", "disabled", "loading"].includes(value),
  },
  text: {
    type: String,
    default: "",
  },
  showIcon: {
    type: Boolean,
    default: false,
  },
  iconPosition: {
    type: String,
    default: "right",
    validator: (value) => ["left", "right"].includes(value),
  },
  decorative: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: undefined,
  },
  backgroundColor: {
    type: String,
    default: undefined,
  },
});

const buttonClasses = computed(() => {
  const baseClasses =
    "flex items-center justify-center font-medium transition-colors rounded-full px-2 md:px-6  ";

  // Resolve color tokens if provided
  const textColorClass = props.color ? resolveColorToken(props.color, 'text') : '';
  const bgColorClass = props.backgroundColor ? resolveBackgroundColor(props.backgroundColor) : '';

  // Check if custom colors should be used (text color must be a Tailwind class, not hex)
  // Background color is always a Tailwind class from resolveBackgroundColor
  const hasCustomTextColor = props.color && textColorClass && !textColorClass.startsWith('#');
  const hasCustomBgColor = props.backgroundColor && bgColorClass;

  // Handle variant-based styling
  if (props.decorative) {
    // Decorative buttons don't have pointer cursor or button-specific interactions
    if (props.variant === "ghost" || props.ghost) {
      const classes = hasCustomTextColor ? textColorClass : 'text-accentColor1';
      const bgClasses = hasCustomBgColor ? bgColorClass : 'bg-[#E6CFB6]';
      return `${baseClasses} border border-accentColor1 ${classes} ${bgClasses}`;
    } else if (props.variant === "disabled" || props.disabled) {
      return `${baseClasses} bg-gray-300 text-gray-500`;
    } else if (props.variant === "loading" || props.loading) {
      const classes = hasCustomTextColor ? textColorClass : 'text-white';
      const bgClasses = hasCustomBgColor ? bgColorClass : 'bg-accentColor1';
      return `${baseClasses} ${bgClasses} ${classes} opacity-75`;
    } else {
      const classes = hasCustomTextColor ? textColorClass : 'text-white';
      const bgClasses = hasCustomBgColor ? bgColorClass : 'bg-accentColor1';
      return `${baseClasses} ${bgClasses} ${classes}`;
    }
  } else {
    // Regular buttons with pointer cursor and button interactions
    if (props.variant === "ghost" || props.ghost) {
      const classes = hasCustomTextColor ? textColorClass : 'text-accentColor1';
      const bgClasses = hasCustomBgColor ? bgColorClass : 'bg-[#E6CFB6]';
      return `${baseClasses} border border-accentColor1 ${classes} ${bgClasses} cursor-pointer`;
    } else if (props.variant === "disabled" || props.disabled) {
      return `${baseClasses} bg-gray-300 text-gray-500 cursor-not-allowed`;
    } else if (props.variant === "loading" || props.loading) {
      const classes = hasCustomTextColor ? textColorClass : 'text-white';
      const bgClasses = hasCustomBgColor ? bgColorClass : 'bg-accentColor1';
      return `${baseClasses} ${bgClasses} ${classes} opacity-75 cursor-not-allowed`;
    } else {
      const classes = hasCustomTextColor ? textColorClass : 'text-white';
      const bgClasses = hasCustomBgColor ? bgColorClass : 'bg-accentColor1';
      return `${baseClasses} ${bgClasses} ${classes} cursor-pointer`;
    }
  }
});

const buttonStyles = computed(() => {
  const styles = {
    height: props.height,
    width: props.width === "full" ? "100%" : props.width,
    fontSize: `${props.fontSize}px`,
  };

  // Apply hex colors as inline styles if provided (only for text color)
  // Background colors are always handled via Tailwind classes
  if (props.color) {
    const resolvedColor = resolveColorToken(props.color, 'text');
    if (resolvedColor && resolvedColor.startsWith('#')) {
      styles.color = resolvedColor;
    }
  }

  return styles;
});
</script>

<style scoped></style>
