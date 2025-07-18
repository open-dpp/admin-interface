<template>
  <div>
    <AdvancedListSelector
      v-if="productDataModels"
      :headers="['ID', 'Name', 'Version']"
      :items="productDataModels"
      :row-actions="actions"
      :rows-per-page="5"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useModelsStore } from "../../stores/models";
import { useIndexStore } from "../../stores";
import AdvancedListSelector from "../lists/AdvancedListSelector.vue";
import apiClient from "../../lib/api-client";
import { ProductDataModelGetAllDto } from "@open-dpp/api-client";

const indexStore = useIndexStore();
const modelsStore = useModelsStore();

const productDataModels = ref<ProductDataModelGetAllDto[]>();

const actions = [
  {
    name: "Artikelpässe",
    actionLinkBuilder: (row: Record<string, string>) =>
      `/organizations/${indexStore.selectedOrganization}/models/${row.id}/items`,
  },
  {
    name: "Editieren",
    actionLinkBuilder: (row: Record<string, string>) =>
      `/organizations/${indexStore.selectedOrganization}/models/${row.id}`,
  },
  {
    name: "QR-Code",
    actionLinkBuilder: (row: Record<string, string>) =>
      `/organizations/${indexStore.selectedOrganization}/models/${row.id}/qr-code`,
  },
];

onMounted(async () => {
  await modelsStore.getModels();
  const response = await apiClient.productDataModels.getAll();
  productDataModels.value = response.data;
});
</script>
