<template>
  <div class="min-h-screen  flex flex-col">
    <LayoutAnnouncementBar />
    <LayoutNavbar :hideNavigation="isCheckoutOrConsultationPage" />
    <main class="flex-1" style="padding-top: var(--header-offset)">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>

<script setup>
// Layout components are auto-imported in Nuxt 3
const route = useRoute();

const isCheckoutOrConsultationPage = computed(() => {
  return route.path === "/checkout" || route.path === "/consultation";
});
</script>
