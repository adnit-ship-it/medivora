<template>
  <UiSectionWrapper v-if="shouldShowDiscover" class="flex-col">
    <!-- Heading -->
    <UiSectionContainer>
      <h2 v-motion :initial="{ opacity: 0, y: 32 }" :visible-once="{
        opacity: 1,
        y: 0,
        transition: {
          duration: 400,
          type: 'ease-in',
          stiffness: 250,
          damping: 25,
          mass: 1,
        },
      }" v-if="showTitle"
        class="pb-[24px] font-defaultSerif text-[20px] md:text-[28px] lg:text-[32px] font-semibold text-black md:text-left">
        {{ sectionData?.heading?.text || 'Discover Our Products' }}
      </h2>
    </UiSectionContainer>

    <UiCardCarousel :items="productList" @item-click="openModal" />

    <!-- Product Modal -->
    <UiProductModal :is-open="isModalOpen" :product="selectedProduct" @close="closeModal" />
  </UiSectionWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useCRMStore } from "~/stores/crmStore";
import { products as staticProductCatalog } from "~/data/intake-form/products";
import type { ExtractedSectionData } from "~/utils/sectionDataExtractor";

const crmStore = useCRMStore();

const props = defineProps<{
  showTitle?: boolean
  filteredProducts?: any[]
  sectionData?: ExtractedSectionData | null
}>()

const shouldShowDiscover = computed(() => props.sectionData?.heading?.show !== false);

// Modal state
const isModalOpen = ref(false);
const selectedProduct = ref(null);

// Transform static products to Discover component format
const staticProductsFormatted = computed(() => {
  return staticProductCatalog.map((product) => {
    const modalProduct = {
      id: product.id,
      imageUrl: product.img,
      productName: product.name,
      price: `$${product.prices.monthly || 0}`,
      productBundleIds: product.productBundleIds,
      quizId: product.quizId,
    };
    return {
      id: product.id,
      imageSrc: product.img,
      imageAlt: product.name,
      productName: product.name,
      price: `$${product.prices.monthly || 0}`,
      isBestSeller: product.popular || false,
      modalProduct,
    };
  });
});

// Product list - computed to use filtered products (if provided) or default logic
const productList = computed(() => {
  // If filtered products are provided from parent, use those (even if empty array)
  if (props.filteredProducts !== undefined) {
    return props.filteredProducts;
  }

  const apiProducts = crmStore.getProductBundles;

  // If we have API data, transform it to match the expected format
  if (apiProducts && apiProducts.length > 0) {
    return apiProducts.map((bundle, index) => {
      // Try to find matching static product for fallback data
      const staticMatch = staticProductCatalog.find(
        (p) =>
          p.id === bundle.id ||
          bundle.name?.toLowerCase().includes(p.name.toLowerCase()) ||
          p.name.toLowerCase().includes(bundle.name?.toLowerCase() || "")
      );
      
      const monthlyBundleId = bundle.id;
      const derivedQuizId =
        bundle.quizId ||
        bundle.formVersion?.forms?.[0]?.slug ||
        bundle.formVersion?.forms?.[0]?.id ||
        staticMatch?.quizId;
      
      const modalProduct = {
        id: bundle.id,
        imageUrl: bundle.imageUrl || staticMatch?.img || "",
        productName: bundle.name || `Product ${index + 1}`,
        price: bundle.price ? `$${bundle.price}` : staticMatch?.prices?.monthly ? `$${staticMatch.prices.monthly}` : "$0",
        productBundleIds: {
          monthly: monthlyBundleId,
        },
        quizId: derivedQuizId,
      };
      return {
        id: bundle.id,
        imageSrc: bundle.imageUrl || staticMatch?.img || "",
        imageAlt: bundle.name || `Product ${index + 1}`,
        productName: bundle.name || `Product ${index + 1}`,
        price: bundle.price ? `$${bundle.price}` : staticMatch?.prices?.monthly ? `$${staticMatch.prices.monthly}` : "$0",
        isBestSeller:
          bundle.tag === "BEST_SELLER" ||
          bundle.tag === "bestseller" ||
          staticMatch?.popular ||
          index === 1,
        modalProduct,
      };
    });
  }
  
  // Fallback to static products if no API data
  return staticProductsFormatted.value;
});

// Fetch CRM data on mount if not already loaded (non-blocking)
onMounted(() => {
  if (crmStore.getProductBundles.length === 0) {
    crmStore.fetchCRMData().catch((error) => {
      console.warn("Failed to fetch CRM data for Discover section:", error);
    });
  }
});

// Open modal with product data
const openModal = (product) => {
  selectedProduct.value = product.modalProduct || null;
  isModalOpen.value = true;
};

// Close modal
const closeModal = () => {
  isModalOpen.value = false;
  selectedProduct.value = null;
};
</script>

<style scoped>
/* Custom styles if needed */
</style>
