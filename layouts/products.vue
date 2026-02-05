<template>
  <div class="min-h-screen bg-backgroundColor flex flex-col">
    <LayoutAnnouncementBar />
    <LayoutNavbar />
    <main class="flex-1" style="padding-top: var(--header-offset)">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>

<script setup>
// Products layout components are auto-imported in Nuxt 3
</script>
