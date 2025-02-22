<template>
  <div class="">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold text-gray-900">Modell</h1>
        <p class="mt-2 text-sm text-gray-700">
          Erstellen Sie eine neues Modell.
        </p>
      </div>
    </div>
    <div class="mt-8 flow-root">
      <CreateModelForm
        v-if="productDataModels"
        :product-data-models="productDataModels"
        @submit="onSubmit"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import CreateModelForm from "../../components/models/CreateModelForm.vue";
import { onMounted, ref } from "vue";
import apiClient from "../../lib/api-client";
import { ProductDataModelGetAllDto } from "@open-dpp/api-client";
import { useRouter } from "vue-router";

const props = defineProps<{
  organizationId: string;
}>();

const productDataModels = ref<ProductDataModelGetAllDto[]>();
const router = useRouter();

const onSubmit = async (
  selectedProductDataModelId: string,
  modelName: string,
) => {
  const response = await apiClient.models.postModel({
    name: modelName,
  });

  await apiClient.models.assignProductDataModelToModel(
    selectedProductDataModelId,
    response.data.id,
  );
  await router.push("/organizations/" + props.organizationId + "/models");
};

onMounted(async () => {
  const response = await apiClient.productDataModels.getProductDataModels();
  productDataModels.value = response.data;
});
</script>
