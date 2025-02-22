<template>
  <div class="flex flex-col gap-3 pb-5 max-w-[1200px]">
    <div class="overflow-hidden bg-white shadow sm:rounded-lg">
      <div class="px-4 py-6 sm:px-6">
        <h3 class="text-base/7 font-semibold text-gray-900">
          Modell Informationen
        </h3>
        <p class="mt-1 max-w-2xl text-sm/6 text-gray-500">
          Modelldetails und Anhänge.
        </p>
      </div>
      <div v-if="modelFormStore.model" class="border-t border-gray-100">
        <dl class="divide-y divide-gray-100">
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-900">ID</dt>
            <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              {{ modelFormStore.model.id }}
            </dd>
          </div>
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-900">Name</dt>
            <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              {{ modelFormStore.model.name }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
    <ModelForm v-if="modelFormStore.model && modelFormStore.productDataModel" />
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import ModelForm from "../../components/models/ModelForm.vue";
import { useModelFormStore } from "../../stores/model.form";

const route = useRoute();
const modelFormStore = useModelFormStore();

onMounted(async () => {
  await modelFormStore.fetchModel(String(route.params.modelId));
});
</script>
