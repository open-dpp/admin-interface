<template>
  <FormSidebar
    v-if="model"
    v-model="showSidebar"
    :dialogTitle="'Modell aktualisieren'"
    @form-submitted="editProduct"
  >
    <div class="flex flex-1 flex-col justify-between">
      <div class="divide-y divide-gray-200 px-4 sm:px-6">
        <div class="space-y-6 pb-5 pt-6">
          <div>
            <label
              class="block text-sm/6 font-medium text-gray-900"
              for="project-name"
              >Name</label
            >
            <div class="mt-2">
              <input
                id="project-name"
                v-model="model.name"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                name="project-name"
                type="text"
              />
            </div>
          </div>
          <div>
            <label
              class="block text-sm/6 font-medium text-gray-900"
              for="description"
              >Beschreibung</label
            >
            <div class="mt-2">
              <textarea
                id="description"
                v-model="model.description"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                name="description"
                rows="4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </FormSidebar>
</template>

<script lang="ts" setup>
import FormSidebar from "./FormSidebar.vue";
import { onMounted, ref, watch } from "vue";
import axiosIns from "../../lib/axios";
import { ModelDto } from "@open-dpp/api-client";

const props = defineProps<{
  modelId?: string;
}>();
const showSidebar = defineModel<boolean>();
const loading = ref<boolean>(false);
const model = ref<ModelDto>();

watch(
  () => props.modelId,
  async (newId: string | undefined) => {
    if (newId !== undefined) {
      await fetchProduct(newId);
    }
  },
);

const emits = defineEmits<{
  (e: "success"): void;
}>();

onMounted(async () => {
  if (props.modelId !== undefined) {
    await fetchProduct(props.modelId);
  }
});

const fetchProduct = async (productId: string) => {
  loading.value = true;
  const response = await axiosIns.get(`models/${productId}`);
  loading.value = false;
  if (response.status === 200) {
    model.value = response.data;
  }
};

const editProduct = async () => {
  loading.value = true;
  const response = await axiosIns.patch(`models/${props.modelId}`, {
    name: model?.value?.name,
    description: model?.value?.description,
  });
  loading.value = false;
  if (response.status === 200) {
    emits("success");
  }
};
</script>
