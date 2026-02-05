<template>
  <nav :class="[
    'w-full fixed z-50 flex justify-center shadow-lg',
    props.color || 'bg-white'
  ]" style="top: var(--announcement-height)">
    <div v-motion :initial="{ opacity: 0.3, y: 8 }" :visible-once="{
      opacity: 1,
      y: 0,
      transition: {
        duration: 400,
        type: 'ease-in',
        stiffness: 250,
        damping: 25,
        mass: 1,
      },
    }" :class="[
      'lg:max-w-[1328px] w-full flex justify-center px-4 md:px-8 pb-2 md:pb-0',
      props.hideNavigation ? 'justify-center' : 'justify-between',
    ]" :style="navbarHeightStyle">
      <!-- Mobile hamburger menu on the left -->
      <button v-if="!props.hideNavigation" class="md:hidden rounded"
        :aria-label="accessibility?.toggleMenu || 'Toggle mobile menu'"
        @click="toggleMobileMenu">
        <img :src="hamburgerIcon?.src || '/assets/images/hamburger-menu.svg'"
          :alt="hamburgerIcon?.alt || accessibility?.menu || 'Menu'" class="h-4 w-4" />
      </button>

      <!-- Logo on center-->
      <div class="flex items-center">
        <NuxtLink to="/">
          <img 
            :src="navbarLogoSrc" 
            :alt="navbarLogoAlt" 
            :style="logoHeightStyle"
            class="w-auto" 
          />
        </NuxtLink>
      </div>
      <div class="flex items-center gap-10">

        <!-- Navigation links in middle -->
        <div v-if="!props.hideNavigation" class="hidden md:flex items-center gap-8">
          <!-- Other pages ordered by pages.json order -->
          <NuxtLink
            v-for="page in navigationPages"
            :key="page.key"
            :to="pagesStore.getPageRoute(page.key)"
          >
            <p class="text-black text-lg font-medium">{{ page.title }}</p>
          </NuxtLink>
        </div>

        <!-- Get Started button on right -->
        <div v-if="!props.hideNavigation" class="flex flex-row items-center md:gap-3 relative">
          <NuxtLink to="/consultation">
            <UiButton width="176px" height="32px" font-size="20">
              {{ buttons?.getStarted || 'Get Started' }}
            </UiButton>
          </NuxtLink>

          <!-- Mobile dropdown menu -->
          <div v-if="isMobileMenuOpen"
            class="lg:hidden absolute top-full right-36 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div class="py-2">
              <!-- Other pages ordered by pages.json order -->
              <NuxtLink
                v-for="page in navigationPages"
                :key="page.key"
                :to="pagesStore.getPageRoute(page.key)"
                class="block px-4 py-2 text-black text-lg font-medium hover:bg-gray-100"
                @click="closeMobileMenu"
              >
                {{ page.title }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { usePagesStore } from "~/stores/pagesStore";

const route = useRoute(); // Auto-imported in Nuxt 3
const pagesStore = usePagesStore();

// Get common config from pagesStore
const common = computed(() => pagesStore.getCommonConfig());
const navigation = computed(() => common.value?.navigation);
const buttons = computed(() => common.value?.buttons);
const accessibility = computed(() => common.value?.accessibility);
const hamburgerIcon = computed(() => common.value?.media?.hamburgerMenu);

// Get navigation pages (home first, then by order)
const navigationPages = computed(() => pagesStore.navigationPages);

// Get common layout for navbar heights
const commonLayout = computed(() => pagesStore.getCommonLayout());

// Get navbar logo from pages.json
const navbarLogoSrc = computed(() => {
  const logoRegistry = pagesStore.pages?.logoRegistry?.primary;
  return logoRegistry?.path || "/assets/images/brand/logo-primary-1.svg";
});
const navbarLogoAlt = computed(() => common.value?.accessibility?.brandLogo || "Brand logo");

// Mobile detection
const isMobile = ref(false);
const isTablet = ref(false);

// Dynamic heights from common.layout
const navbarHeightStyle = computed(() => {
  const heights = commonLayout.value?.navbar?.height;
  if (!heights) {
    return { height: isMobile.value ? '83px' : '68px' };
  }
  return {
    height: isMobile.value ? heights.mobile : heights.desktop
  };
});

const logoHeightStyle = computed(() => {
  const logoSizes = pagesStore.pages?.logoSizes?.navbar;
  if (!logoSizes) {
    return { height: isMobile.value ? '24px' : isTablet.value ? '28px' : '28px' };
  }
  return {
    height: isMobile.value ? logoSizes.height.mobile : isTablet.value ? logoSizes.height.tablet : logoSizes.height.desktop
  };
});

// Define the color prop with a default value of 'bg-white'
const props = defineProps({
  color: {
    type: String,
    default: "bg-white",
  },
  hideNavigation: {
    type: Boolean,
    default: false,
  },
});

// Mobile menu state
const isMobileMenuOpen = ref(false);

// Toggle mobile menu
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// Close mobile menu
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// Close mobile menu when clicking outside
const handleClickOutside = (event) => {
  if (isMobileMenuOpen.value && !event.target.closest("nav")) {
    closeMobileMenu();
  }
};

// Check mobile on mount and resize
const checkMobile = () => {
  if (!process.client) return;
  isMobile.value = window.innerWidth <= 768;
  isTablet.value = window.innerWidth > 768 && window.innerWidth <= 1024;
};

// Add click outside listener
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", checkMobile);
});
</script>

<style scoped>
/* Custom styles if needed */
</style>
