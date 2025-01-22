<template>
  <section>
    <CreateProduct @success="onProductsChanged" v-model="showCreateProduct" />
    <UpdateProduct
      @success="onProductsChanged"
      :product-id="selectedProductId"
      v-model="showUpdateProduct"
    />
    <div class="flex flex-col gap-3 p-3">
      <ProductList
        v-if="productStore.products.length > 0"
        @add="showCreateProduct = true"
        @edit="onSelect"
      />
      <EmptyState
        :button-label="buttonLabel"
        v-else
        @add="showCreateProduct = true"
      />
    </div>
  </section>
</template>
<script lang="ts" setup>
import ProductList from "../components/products/ProductList.vue";
import CreateProduct from "../components/products/CreateProduct.vue";
import { onMounted, ref } from "vue";
import { useProductsStore } from "../stores/products.ts";
import EmptyState from "../components/products/EmptyState.vue";
import UpdateProduct from "../components/products/UpdateProduct.vue";

const buttonLabel = "Neues Produkt hinzufügen";
const productStore = useProductsStore();

const showCreateProduct = ref<boolean>(false);
const showUpdateProduct = ref<boolean>(false);
const selectedProductId = ref<string>();

const onSelect = async (productId: string) => {
  showUpdateProduct.value = true;
  selectedProductId.value = productId;
};

const onProductsChanged = async () => {
  showCreateProduct.value = false;
  showUpdateProduct.value = false;
  await productStore.fetchProducts();
};

onMounted(async () => {
  await productStore.fetchProducts();
});
</script>
