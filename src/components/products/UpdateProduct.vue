<template>
  <FormSidebar
    v-if="product"
    v-model="showSidebar"
    :dialogTitle="'Produkt aktualisieren'"
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
import { watch, ref, onMounted } from "vue";
import axiosIns from "../../lib/axios.ts";
import Product from "../../types/Product.ts";

const props = defineProps<{
  productId?: string;
}>();
const showSidebar = defineModel<boolean>();
const loading = ref<boolean>(false);
const product = ref<Product>();

watch(
  () => props.productId,
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
  if (props.productId !== undefined) {
    await fetchProduct(props.productId);
  }
});

const fetchProduct = async (productId: string) => {
  loading.value = true;
  const response = await axiosIns.get(`products/${productId}`);
  loading.value = false;
  if (response.status === 200) {
    product.value = response.data;
  }
};

const editProduct = async () => {
  loading.value = true;
  const response = await axiosIns.patch(`products/${props.productId}`, {
    name: product?.value?.name,
    description: product?.value?.description,
  });
  loading.value = false;
  if (response.status === 200) {
    emits("success");
  }
};
</script>
