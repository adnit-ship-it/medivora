<template>
  <UiSectionWrapper v-if="shouldShowProductsPage" class="py-24 md:py-32 flex-col">
    <template v-for="section in productsSections" :key="section?.name">
      <DynamicSection
        v-if="section && section.show !== false"
        :section="section"
        :additional-props="getAdditionalProps(section)"
        @update:selectedCategory="selectedCategory = $event"
      />
    </template>
  </UiSectionWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { usePagesStore } from "~/stores/pagesStore";
import { useCRMStore } from "~/stores/crmStore";
import { getAllAvailableCategories, products as staticProducts } from "~/data/intake-form/products";

const pagesStore = usePagesStore();
const crmStore = useCRMStore();

// Ensure pages + sections are loaded before rendering
await pagesStore.loadAll()

// Get products page config
const productsPage = computed(() => pagesStore.getPageConfig('products'));
const shouldShowProductsPage = computed(() => (productsPage.value?.show ?? true));

// Get sections for products page
const productsSections = computed(() => pagesStore.getPageSections('products'));

// Get additional props for each section
const getAdditionalProps = (section: any) => {
  const props: any = {};
  
  if (section.name === 'Products Hero') {
    props.productsPage = productsPage.value;
    props.availableCategories = availableCategories.value;
    props.selectedCategory = selectedCategory.value;
  }
  
  if (section.name === 'Products Discover') {
    props.filteredProducts = filteredProducts.value;
  }
  
  return props;
};

// Category filter state - defaults to 'all'
const selectedCategory = ref('all');

// Get available categories (only categories that have products)
// Merge categories from both static products and CRM products
const availableCategories = computed(() => {
  const crmProducts = crmStore.getProductBundles;
  return getAllAvailableCategories(crmProducts);
});

// Helper function to get category from a product (supports both static and CRM products)
const getProductCategory = (product) => {
  // Check if it has a direct category field
  if (product.category) {
    return product.category;
  }
  
  // Check nested CRM structure
  if (product.products && Array.isArray(product.products)) {
    for (const prod of product.products) {
      if (prod.categories && Array.isArray(prod.categories)) {
        const category = prod.categories[0];
        if (category?.name) {
          return category.name.toLowerCase().replace(/\s+/g, '-');
        }
        if (category?.id) {
          return category.id;
        }
      }
    }
  }
  
  // Try to match CRM product name to static product
  if (product.name || product.productName) {
    const searchName = (product.name || product.productName).toLowerCase();
    const staticMatch = staticProducts.find((p) => 
      p.name.toLowerCase() === searchName ||
      searchName.includes(p.name.toLowerCase()) ||
      p.name.toLowerCase().includes(searchName)
    );
    if (staticMatch?.category) {
      return staticMatch.category;
    }
  }
  
  return null;
};

// Get all products from both static and CRM sources, transformed to Discover format
const allProducts = computed(() => {
  const crmProducts = crmStore.getProductBundles;
  // Note: fallbackProducts removed from sections.json - using empty array
  const discoverProducts: any[] = [];
  
  const transformedProducts = [];
  const addedProductIds = new Set();
  
  // Transform CRM products first (they take priority)
  if (crmProducts && crmProducts.length > 0) {
    crmProducts.forEach((bundle, index) => {
      const fallback = discoverProducts[index % discoverProducts.length] || {};
      const monthlyBundleId = bundle.id;
      const derivedQuizId =
        bundle.quizId ||
        bundle.formVersion?.forms?.[0]?.slug ||
        bundle.formVersion?.forms?.[0]?.id;
      
      const staticMatch = staticProducts.find((p) => 
        p.id === bundle.id || 
        bundle.name?.toLowerCase().includes(p.name.toLowerCase()) ||
        p.name.toLowerCase().includes(bundle.name?.toLowerCase())
      );
      
      const modalProduct = {
        id: bundle.id,
        imageUrl: bundle.imageUrl || staticMatch?.img || fallback.image?.src || "",
        productName: bundle.name || `Product ${index + 1}`,
        price: bundle.price ? `$${bundle.price}` : fallback.price || "$0",
        productBundleIds: {
          monthly: monthlyBundleId,
        },
        quizId: derivedQuizId || staticMatch?.quizId,
      };
      
      transformedProducts.push({
        id: bundle.id,
        imageSrc: bundle.imageUrl || staticMatch?.img || fallback.image?.src || "",
        imageAlt: bundle.name || `Product ${index + 1}`,
        productName: bundle.name || `Product ${index + 1}`,
        price: bundle.price ? `$${bundle.price}` : "$0",
        isBestSeller:
          bundle.tag === "BEST_SELLER" ||
          bundle.tag === "bestseller" ||
          index === 1,
        modalProduct,
        _sourceCategory: getProductCategory(bundle),
      });
      
      addedProductIds.add(bundle.id);
    });
  }
  
  // Transform static products (only if not already added via CRM)
  staticProducts.forEach((staticProduct) => {
    // Skip if this product was already added from CRM
    if (addedProductIds.has(staticProduct.id)) {
      return;
    }
    
    const discoverMatch = discoverProducts.find((dp) => dp.id === staticProduct.id);
    
    const modalProduct = {
      id: staticProduct.id,
      imageUrl: staticProduct.img || discoverMatch?.image?.src || "",
      productName: staticProduct.name,
      price: discoverMatch?.price || `$${staticProduct.prices.monthly || 0}`,
      productBundleIds: staticProduct.productBundleIds,
      quizId: staticProduct.quizId,
    };
    
    transformedProducts.push({
      id: staticProduct.id,
      imageSrc: staticProduct.img || discoverMatch?.image?.src || "",
      imageAlt: discoverMatch?.image?.alt || staticProduct.name,
      productName: staticProduct.name,
      price: discoverMatch?.price || `$${staticProduct.prices.monthly || 0}`,
      isBestSeller: discoverMatch?.isBestSeller || staticProduct.popular || false,
      modalProduct,
      _sourceCategory: staticProduct.category,
    });
  });
  
  return transformedProducts;
});

// Filter products based on selected category
const filteredProducts = computed(() => {
  if (selectedCategory.value === 'all') {
    return allProducts.value;
  }
  
  return allProducts.value.filter((product) => {
    const productCategory = product._sourceCategory;
    return productCategory === selectedCategory.value;
  });
});

onMounted(() => {
  // Fetch CRM data if not already loaded to ensure categories are available
  if (crmStore.getProductBundles.length === 0) {
    crmStore.fetchCRMData().catch((error) => {
      console.warn("Failed to fetch CRM data for categories:", error);
    });
  }
});

definePageMeta({
  layout: "products",
});
// Products page logic
</script>

<style scoped>
/* Products page styles */
</style>
