<!--
  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
-->
<template>
  <ul
    class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
    role="list"
  >
    <li v-for="file in files" :key="file.source" class="relative">
      <div
        class="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100"
      >
        <img
          :src="file.source"
          alt=""
          class="pointer-events-none object-cover group-hover:opacity-75"
        />
        <button class="absolute inset-0 focus:outline-hidden" type="button">
          <span class="sr-only">View details for {{ file.title }}</span>
        </button>
      </div>
      <p
        class="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900"
      >
        {{ file.title }}
      </p>
      <p class="pointer-events-none block text-sm font-medium text-gray-500">
        {{ file.size }}
      </p>
    </li>
  </ul>
</template>

<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const files: any[] = [];
for (let i = 0; i < 26; i++) {
  files.push({
    title: "IMG_4985.HEIC",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  });
}
</script>
