<template>
  <div class="overflow-hidden bg-white shadow sm:rounded-lg">
    <div class="px-4 py-6 sm:px-6">
      <h3 class="text-base/7 font-semibold text-gray-900">
        Produkt Informationen
      </h3>
      <p class="mt-1 max-w-2xl text-sm/6 text-gray-500">
        Produktdetails und Anhänge.
      </p>
    </div>
    <div v-if="product" class="border-t border-gray-100">
      <dl class="divide-y divide-gray-100">
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-900">ID</dt>
          <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
            {{ product.id }}
          </dd>
        </div>
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-900">Name</dt>
          <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
            {{ product.name }}
          </dd>
        </div>
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-900">Erstellt am</dt>
          <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
            {{ product.createdAt }}
          </dd>
        </div>
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-900">Erstellt von</dt>
          <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
            margotfoster@example.com
          </dd>
        </div>
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-900">Anzahl Aufrufe</dt>
          <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
            120.000
          </dd>
        </div>
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-900">Beschreibung</dt>
          <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
            Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim
            incididunt cillum culpa consequat. Excepteur qui ipsum aliquip
            consequat sint. Sit id mollit nulla mollit nostrud in ea officia
            proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit
            deserunt qui eu.
          </dd>
        </div>
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm/6 font-medium text-gray-900">Anhänge</dt>
          <dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            <ul
              class="divide-y divide-gray-100 rounded-md border border-gray-200"
              role="list"
            >
              <li
                class="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6"
              >
                <div class="flex w-0 flex-1 items-center">
                  <PaperClipIcon
                    aria-hidden="true"
                    class="h-5 w-5 flex-shrink-0 text-gray-400"
                  />
                  <div class="ml-4 flex min-w-0 flex-1 gap-2">
                    <span class="truncate font-medium">datenblatt.pdf</span>
                    <span class="flex-shrink-0 text-gray-400">2.4mb</span>
                  </div>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <a
                    class="font-medium text-indigo-600 hover:text-indigo-500"
                    href="#"
                    >Download</a
                  >
                </div>
              </li>
              <li
                class="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6"
              >
                <div class="flex w-0 flex-1 items-center">
                  <PaperClipIcon
                    aria-hidden="true"
                    class="h-5 w-5 flex-shrink-0 text-gray-400"
                  />
                  <div class="ml-4 flex min-w-0 flex-1 gap-2">
                    <span class="truncate font-medium">handbuch.pdf</span>
                    <span class="flex-shrink-0 text-gray-400">4.5mb</span>
                  </div>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <a
                    class="font-medium text-indigo-600 hover:text-indigo-500"
                    href="#"
                    >Download</a
                  >
                </div>
              </li>
            </ul>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PaperClipIcon } from "@heroicons/vue/20/solid";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import Product from "../../types/Product";
import axiosIns from "../../lib/axios";

const route = useRoute();

const product = ref<Product>();

onMounted(async () => {
  const response = await axiosIns.get(`/products/${route.params.productId}`);
  product.value = response.data;
});
</script>
