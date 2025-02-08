<template>
  <FormSidebar
    v-model="showSidebar"
    :dialogTitle="'Neues Produkt'"
    @form-submitted="addProduct"
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
                v-model="product.name"
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
                v-model="product.description"
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
import { ref } from "vue";
import Product from "../../types/Product";
import apiClient from "../../lib/api-client";

const showSidebar = defineModel<boolean>();

const loading = ref<boolean>(false);
const initialProduct = { name: "", description: "" };
const product = ref<Pick<Product, "name" | "description">>(initialProduct);

const emits = defineEmits<{
  (e: "success"): void;
}>();

const addProduct = async () => {
  loading.value = true;
  const response = await apiClient.postModel(product.value);
  loading.value = false;
  if (response.status === 201) {
    emits("success");
  }
};
</script>
