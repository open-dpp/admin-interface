<template>
  <section>
    <CreateModel v-model="showCreateProduct" @success="onProductsChanged" />
    <UpdateModel
      v-model="showUpdateProduct"
      :product-id="selectedProductId"
      @success="onProductsChanged"
    />
    <div class="flex flex-col gap-3 p-3">
      <ModelList
        v-if="modelsStore.models.length > 0"
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
import ModelList from "../../components/models/ModelList.vue";
import CreateModel from "../../components/models/CreateModel.vue";
import { onMounted, ref } from "vue";
import { useModelsStore } from "../../stores/models";
import EmptyState from "../../components/models/EmptyState.vue";
import UpdateModel from "../../components/models/UpdateModel.vue";

const modelsStore = useModelsStore();
const buttonLabel = "Neues Produkt hinzufügen";

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
  await modelsStore.getModels();
};

onMounted(async () => {
  await modelsStore.getModels();
});
</script>
