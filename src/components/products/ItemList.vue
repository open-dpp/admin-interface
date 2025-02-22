<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold text-gray-900">Artikel</h1>
        <p class="mt-2 text-sm text-gray-700">Alle erstellten Artikel</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
          class="block rounded-md bg-indigo-600 px-3 py-1.5 text-center text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          type="button"
          @click="emits('add')"
        >
          Artikel hinzufügen
        </button>
      </div>
    </div>
    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div class="relative">
            <div
              v-if="selectedItems.length > 0"
              class="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-white sm:left-12"
            >
              <button
                class="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                type="button"
              >
                Alle bearbeiten
              </button>
              <button
                class="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                type="button"
              >
                Alle löschen
              </button>
            </div>
            <table class="min-w-full table-fixed divide-y divide-gray-300">
              <thead>
                <tr>
                  <th class="relative px-7 sm:w-12 sm:px-6" scope="col">
                    <input
                      :checked="
                        indeterminate || selectedItems.length === items.length
                      "
                      :indeterminate="indeterminate"
                      class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      type="checkbox"
                      @change="
                        selectedItems = ($event.target as HTMLInputElement)
                          .checked
                          ? items.map((i) => i.id)
                          : []
                      "
                    />
                  </th>
                  <th
                    class="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                    scope="col"
                  >
                    ID
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="item in props.items" :key="item.id">
                  <td class="relative px-7 sm:w-12 sm:px-6">
                    <div
                      v-if="selectedItems.includes(item.id)"
                      class="absolute inset-y-0 left-0 w-0.5 bg-indigo-600"
                    ></div>
                    <input
                      v-model="selectedItems"
                      :value="item.id"
                      class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      type="checkbox"
                    />
                  </td>
                  <td
                    :class="[
                      'whitespace-nowrap py-4 pr-3 text-sm font-medium',
                      selectedItems.includes(item.id)
                        ? 'text-indigo-600'
                        : 'text-gray-900',
                    ]"
                  >
                    {{ item.id }}
                  </td>
                  <td>
                    <router-link
                      :to="`/organizations/${indexStore.selectedOrganization}/items/${item.id}/qr-code`"
                      append
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      QR-Code<span class="sr-only">, {{ item.id }}</span>
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import Item from "../../types/Item";
import { useIndexStore } from "../../stores";

const indexStore = useIndexStore();

const props = defineProps<{
  items: Item[];
}>();

//
const emits = defineEmits<{
  (e: "add"): void;
}>();
//
const selectedItems = ref<string[]>([]);

const indeterminate = computed(
  () =>
    selectedItems.value.length > 0 &&
    selectedItems.value.length < props.items.length,
);
</script>
