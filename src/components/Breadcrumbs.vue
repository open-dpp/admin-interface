<template>
  <nav aria-label="Breadcrumb" class="flex border-b border-gray-200 bg-white">
    <ol class="ml-3 flex w-full max-w-screen-xl space-x-4 px-4 sm:px-6 lg:px-8" role="list">
      <li class="flex">
        <div class="flex items-center">
          <router-link class="text-gray-400 hover:text-gray-500" to="/">
            <HomeIcon aria-hidden="true" class="h-5 w-5 flex-shrink-0"/>
            <span class="sr-only">Home</span>
          </router-link>
        </div>
      </li>
      <li v-for="page in pages" :key="page.name" class="flex">
        <div class="flex items-center">
          <svg aria-hidden="true" class="h-full w-6 flex-shrink-0 text-gray-200" fill="currentColor"
               preserveAspectRatio="none" viewBox="0 0 24 44">
            <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z"/>
          </svg>
          <router-link :aria-current="page.current ? 'page' : undefined" :to="page.to"
                       class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">{{ page.name }}
          </router-link>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script lang="ts" setup>
import {HomeIcon} from '@heroicons/vue/20/solid'

const pages = [
  {name: 'Produkte', to: '/products', current: false},
]
</script>