<template>
  <div>
    <div class="grid grid-cols-1 sm:hidden">
      <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
      <select
        aria-label="Select a tab"
        class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
      >
        <option v-for="tab in tabs" :key="tab.name" :selected="tab.current">
          {{ tab.name }}
        </option>
      </select>
      <ChevronDownIcon
        aria-hidden="true"
        class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
      />
    </div>
    <div class="hidden sm:block">
      <nav
        aria-label="Tabs"
        class="isolate flex divide-x divide-gray-200 rounded-lg shadow-sm"
      >
        <a
          v-for="(tab, tabIdx) in tabs"
          :key="tab.name"
          :aria-current="tab.current ? 'page' : undefined"
          :class="[
            tab.current ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
            tabIdx === 0 ? 'rounded-l-lg' : '',
            tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
            'group relative min-w-0 flex-1 overflow-hidden bg-white px-4 py-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10',
          ]"
          :href="tab.href"
        >
          <span>{{ tab.name }}</span>
          <span
            :class="[
              tab.current ? 'bg-indigo-500' : 'bg-transparent',
              'absolute inset-x-0 bottom-0 h-0.5',
            ]"
            aria-hidden="true"
          />
        </a>
      </nav>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ChevronDownIcon } from "@heroicons/vue/16/solid";

const tabs = [
  { name: "Vorlagen deiner Organisation", href: "#", current: false },
  { name: "Marktplatz", href: "#", current: false },
];
</script>
