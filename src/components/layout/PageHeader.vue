<template>
  <div class="lg:flex lg:items-center lg:justify-between">
    <div class="min-w-0 flex-1">
      <nav aria-label="Breadcrumb" class="flex">
        <ol class="flex items-center space-x-4" role="list">
          <li>
            <div class="flex">
              <a
                class="text-sm font-medium text-gray-500 hover:text-gray-700"
                href="#"
                >Jobs</a
              >
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <ChevronRightIcon
                aria-hidden="true"
                class="h-5 w-5 flex-shrink-0 text-gray-400"
              />
              <a
                class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                href="#"
                >Engineering</a
              >
            </div>
          </li>
        </ol>
      </nav>
      <h2
        class="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
      >
        Back End Developer
      </h2>
      <div
        class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6"
      >
        <div class="mt-2 flex items-center text-sm text-gray-500">
          <BriefcaseIcon
            aria-hidden="true"
            class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
          />
          Full-time
        </div>
        <div class="mt-2 flex items-center text-sm text-gray-500">
          <MapPinIcon
            aria-hidden="true"
            class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
          />
          Remote
        </div>
        <div class="mt-2 flex items-center text-sm text-gray-500">
          <CalendarIcon
            aria-hidden="true"
            class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
          />
          Closing on January 9, 2020
        </div>
      </div>
    </div>
    <div class="mt-5 flex lg:ml-4 lg:mt-0">
      <span class="hidden sm:block">
        <button
          class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          type="button"
        >
          <PencilIcon
            aria-hidden="true"
            class="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
          />
          Edit
        </button>
      </span>

      <span class="ml-3 hidden sm:block">
        <button
          class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          type="button"
        >
          <LinkIcon
            aria-hidden="true"
            class="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
          />
          View
        </button>
      </span>

      <span class="sm:ml-3">
        <button
          class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          type="button"
        >
          <CheckIcon aria-hidden="true" class="-ml-0.5 mr-1.5 h-5 w-5" />
          Publish
        </button>
      </span>

      <!-- Dropdown -->
      <Menu as="div" class="relative ml-3 sm:hidden">
        <MenuButton
          class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
        >
          More
          <ChevronDownIcon
            aria-hidden="true"
            class="-mr-1 ml-1.5 h-5 w-5 text-gray-400"
          />
        </MenuButton>

        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <MenuItems
            class="absolute right-0 z-10 -mr-1 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <MenuItem v-slot="{ active }">
              <a
                :class="[
                  active ? 'bg-gray-100' : '',
                  'block px-4 py-2 text-sm text-gray-700',
                ]"
                href="#"
                >Edit</a
              >
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <a
                :class="[
                  active ? 'bg-gray-100' : '',
                  'block px-4 py-2 text-sm text-gray-700',
                ]"
                href="#"
                >View</a
              >
            </MenuItem>
          </MenuItems>
        </transition>
      </Menu>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon,
} from "@heroicons/vue/20/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
</script>
