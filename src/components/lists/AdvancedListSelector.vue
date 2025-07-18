<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold text-gray-900">
          Modellpassvorlagen
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          Wählen Sie die passende Vorlage für Ihre Modelpässe!.
        </p>
      </div>
      <div class="flex flex-row gap-3 mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          v-show="false"
          class="block rounded-full px-3 py-1.5 text-center text-sm/6 font-semibold text-black shadow-xs hover:bg-indigo-500 hover:text-white hover:cursor-pointer"
          type="button"
        >
          <MagnifyingGlassIcon class="h-5 w-5" />
        </button>
        <div class="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
          <div
            class="flex items-center px-6 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none xl:px-0"
          >
            <div class="grid w-full grid-cols-1">
              <input
                class="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pr-3 pl-10 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 max-w-32 focus:max-w-none"
                name="search"
                placeholder="Search"
                type="search"
              />
              <MagnifyingGlassIcon
                aria-hidden="true"
                class="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400"
              />
            </div>
          </div>
        </div>
        <Dropdown
          :icon="FunnelIcon"
          :items="[
            { text: 'Suchen', icon: MagnifyingGlassIcon },
            { text: 'Version' },
          ]"
          title="Sortieren"
        />
        <Dropdown
          :icon="EllipsisVerticalIcon"
          :items="[
            { text: 'Suchen', icon: MagnifyingGlassIcon },
            { text: 'Version' },
          ]"
          title="Sortieren"
        />
      </div>
    </div>
    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div class="relative">
            <div
              v-if="selected.length > 0"
              class="absolute top-0 left-14 flex h-12 items-center space-x-3 bg-white sm:left-12"
            >
              <button
                class="inline-flex items-center rounded-sm bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                type="button"
              >
                Bulk edit
              </button>
              <button
                class="inline-flex items-center rounded-sm bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                type="button"
              >
                Delete all
              </button>
            </div>
            <table class="min-w-full table-fixed divide-y divide-gray-300">
              <thead>
                <tr>
                  <th class="relative px-7 sm:w-12 sm:px-6" scope="col">
                    <div
                      class="group absolute top-1/2 left-4 -mt-2 grid size-4 grid-cols-1"
                    >
                      <input
                        :checked="
                          indeterminate || selected.length === items.length
                        "
                        :indeterminate="indeterminate"
                        class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                        type="checkbox"
                      />
                      <svg
                        class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          class="opacity-0 group-has-checked:opacity-100"
                          d="M3 8L6 11L11 3.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                        />
                        <path
                          class="opacity-0 group-has-indeterminate:opacity-100"
                          d="M3 7H11"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                        />
                      </svg>
                    </div>
                  </th>
                  <th
                    v-for="(header, index) in headers"
                    :key="index"
                    class="min-w-48 py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                    scope="col"
                  >
                    {{ header }}
                  </th>
                  <th class="relative py-3.5 pr-4 pl-3 sm:pr-3" scope="col">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr
                  v-for="item in itemsOfPage"
                  :key="item.id"
                  :class="[
                    selected.some(
                      (selectedItemId) => selectedItemId === item.id,
                    ) && 'bg-gray-50',
                  ]"
                >
                  <td class="relative px-7 sm:w-12 sm:px-6">
                    <div
                      v-if="
                        selected.some(
                          (selectedItemId) => selectedItemId === item.id,
                        )
                      "
                      class="absolute inset-y-0 left-0 w-0.5 bg-indigo-600"
                    ></div>
                    <div
                      class="group absolute top-1/2 left-4 -mt-2 grid size-4 grid-cols-1"
                    >
                      <input
                        v-model="selected"
                        :value="item.id"
                        class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                        type="checkbox"
                      />
                      <svg
                        class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          class="opacity-0 group-has-checked:opacity-100"
                          d="M3 8L6 11L11 3.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                        />
                        <path
                          class="opacity-0 group-has-indeterminate:opacity-100"
                          d="M3 7H11"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                        />
                      </svg>
                    </div>
                  </td>
                  <td
                    :class="[
                      'py-4 pr-3 text-sm font-medium whitespace-nowrap',
                      selected.some(
                        (selectedItemId) => selectedItemId === item.id,
                      )
                        ? 'text-indigo-600'
                        : 'text-gray-900',
                    ]"
                  >
                    {{ item.id }}
                  </td>
                  <td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                    {{ item.name }}
                  </td>
                  <td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                    {{ item.version }}
                  </td>
                  <td
                    class="py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-3"
                  >
                    <a class="text-indigo-600 hover:text-indigo-900" href="#">
                      Edit<span class="sr-only">, {{ item.id }}</span>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div v-if="rowsPerPage">
      <Pagination
        :current-page="page"
        :items-per-page="rowsPerPage"
        :total-items="items.length"
      />
    </div>
  </div>
</template>

<script generic="T extends AdvancedListItem" lang="ts" setup>
import { computed, ref } from "vue";
import { AdvancedListItem } from "./AdvancedListItem.interface";
import { useIndexStore } from "../../stores";
import {
  EllipsisVerticalIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/16/solid";
import Dropdown from "../Dropdown.vue";
import Pagination from "./Pagination.vue";

const indexStore = useIndexStore();

const props = defineProps<{
  headers: string[];
  items: Array<T>;
  rows: Array<string>;
  ignoreRowKeys?: string[];
  rowActions: {
    name: string;
    actionLinkBuilder: (row: Record<string, string>) => string;
  }[];
  rowsPerPage?: number;
  selectable?: boolean;
  multiple?: boolean;
}>();

const selected = ref<Array<string>>([]);
const page = ref<number>(0);

const indeterminate = computed(
  () => selected.value.length > 0 && selected.value.length < props.items.length,
);

const headers = computed(() =>
  props.rowActions.length > 0 ? [...props.headers, "Aktionen"] : props.headers,
);

const itemsOfPage = computed(() => {
  if (props.rowsPerPage) {
    return props.items.slice(
      page.value * props.rowsPerPage,
      (page.value + 1) * props.rowsPerPage,
    );
  }
  return props.items;
});
</script>
