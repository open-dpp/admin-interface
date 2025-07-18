<template>
  <div
    class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
  >
    <div class="flex flex-1 justify-between sm:hidden">
      <a
        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        href="#"
        >Previous</a
      >
      <a
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        href="#"
        >Next</a
      >
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Zeigt
          {{ " " }}
          <span class="font-medium">{{ currentPage * itemsPerPage }}</span>
          {{ " " }}
          bis
          {{ " " }}
          <span class="font-medium">{{
            currentPage * itemsPerPage + itemsPerPage
          }}</span>
          {{ " " }}
          von
          {{ " " }}
          <span class="font-medium">{{ totalItems }}</span>
          {{ " " }}
          Elementen
        </p>
      </div>
      <div>
        <nav
          aria-label="Pagination"
          class="isolate inline-flex -space-x-px rounded-md shadow-xs"
        >
          <button
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            @click="
              currentPage === 0
                ? () => {}
                : emits('page-changed', currentPage - 1)
            "
          >
            <span class="sr-only">Previous</span>
            <ChevronLeftIcon aria-hidden="true" class="size-5" />
          </button>
          <!-- Current: "z-10 bg-indigo-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" -->
          <button
            v-for="(action, index) in actions"
            :key="index"
            :aria-current="action.page === currentPage ? 'page' : undefined"
            :class="{
              'bg-indigo-600 focus-visible:outline-indigo-600':
                action.page === currentPage,
            }"
            class="relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 hover:cursor-pointer"
            @click="emits('page-changed', action.page)"
          >
            {{ action.page + 1 }}
          </button>
          <a
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            href="#"
            >2</a
          >
          <a
            class="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
            href="#"
            >3</a
          >
          <span
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0"
            >...</span
          >
          <a
            class="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
            href="#"
            >8</a
          >
          <a
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            href="#"
            >9</a
          >
          <a
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            href="#"
            >10</a
          >
          <a
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            href="#"
          >
            <span class="sr-only">Next</span>
            <ChevronRightIcon aria-hidden="true" class="size-5" />
          </a>
        </nav>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/20/solid";
import { computed } from "vue";

const props = defineProps<{
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
}>();

const emits = defineEmits<{
  (e: "page-changed", page: number): void;
}>();

const totalPages = computed(() => {
  return Math.ceil(props.totalItems / props.itemsPerPage);
});

const actions = computed<
  Array<{
    label: string;
    page: number;
  }>
>(() => {
  if (totalPages.value === 0) {
    return [
      {
        label: String(props.currentPage),
        page: props.currentPage,
      },
    ];
  }
  if (props.currentPage === 0) {
    return [
      {
        label: String(props.currentPage),
        page: props.currentPage,
      },
    ];
  }
  return [
    {
      label: String(props.currentPage),
      page: props.currentPage,
    },
  ];
});
</script>
