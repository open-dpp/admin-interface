<template>
  <div class="flex flex-col gap-3">
    <div class="overflow-hidden bg-white shadow sm:rounded-lg">
      <div class="px-4 py-6 sm:px-6">
        <h3 class="text-base/7 font-semibold text-gray-900">
          Modell Informationen
        </h3>
        <p class="mt-1 max-w-2xl text-sm/6 text-gray-500">
          Modelldetails und Anhänge.
        </p>
      </div>
      <div v-if="model" class="border-t border-gray-100">
        <dl class="divide-y divide-gray-100">
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-900">ID</dt>
            <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              {{ model.id }}
            </dd>
          </div>
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-900">Name</dt>
            <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              {{ model.name }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
    <ModelForm
      v-if="model && productDataModel"
      :model="model"
      :product-data-model="productDataModel"
      @submit="onSubmit"
    />
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import {
  DataValuePatchDto,
  ModelDto,
} from "@open-dpp/api-client/dist/model.dto";
import apiClient from "../../lib/api-client";
import { ProductDataModelDto } from "@open-dpp/api-client/dist/product.data.model.dto";
import ModelForm from "../../components/models/ModelForm.vue";

const route = useRoute();

const model = ref<ModelDto>();
const productDataModel = ref<ProductDataModelDto>();

const onSubmit = async (dataValues: DataValuePatchDto[]) => {
  if (model.value) {
    await apiClient.updateModelData(model.value.id, dataValues);
  }
};

onMounted(async () => {
  const response = await apiClient.getModelById(String(route.params.modelId));
  model.value = response.data;
  if (model.value.productDataModelId) {
    const response = await apiClient.getProductDataModelById(
      model.value.productDataModelId,
    );
    productDataModel.value = response.data;
  }
});
</script>
