<template>
  <div>
    <div>
      <nav aria-label="Back" class="sm:hidden">
        <a
          class="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          href="#"
        >
          <ChevronLeftIcon
            aria-hidden="true"
            class="-ml-1 mr-1 h-5 w-5 shrink-0 text-gray-400"
          />
          Back
        </a>
      </nav>
      <nav aria-label="Breadcrumb" class="hidden sm:flex">
        <ol class="flex items-center space-x-4" role="list">
          <li>
            <div class="flex">
              <router-link
                class="text-sm font-medium text-gray-500 hover:text-gray-700"
                to="/models"
                >Modelle
              </router-link>
            </div>
          </li>
        </ol>
      </nav>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ChevronLeftIcon } from "@heroicons/vue/20/solid";
</script>
