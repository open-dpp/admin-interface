<template>
  <div>
    <TransitionRoot :show="sidebarOpen" as="template">
      <Dialog class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild
                as="template"
                enter="ease-in-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in-out duration-300"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div
                  class="absolute left-full top-0 flex w-16 justify-center pt-5"
                >
                  <button
                    class="-m-2.5 p-2.5"
                    type="button"
                    @click="sidebarOpen = false"
                  >
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon aria-hidden="true" class="h-6 w-6 text-white" />
                  </button>
                </div>
              </TransitionChild>
              <!-- Sidebar component, swap this element with another sidebar if you like -->
              <div
                class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4"
              >
                <div class="flex h-16 shrink-0 items-center">
                  <img :src="logo" alt="GJ Logo" class="h-8 w-auto" />
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul class="flex flex-1 flex-col gap-y-7" role="list">
                    <li>
                      <ul class="-mx-2 space-y-1" role="list">
                        <li v-for="item in navigation" :key="item.name">
                          <router-link
                            :class="[
                              item.to === route.path
                                ? 'bg-gray-50 text-GJDarkGreen'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-GJDarkGreen',
                              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                            ]"
                            :to="item.to"
                          >
                            <component
                              :is="item.icon"
                              :class="[
                                item.to === route.path
                                  ? 'text-GJDarkGreen'
                                  : 'text-gray-400 group-hover:text-GJDarkGreen',
                                'h-6 w-6 shrink-0',
                              ]"
                              aria-hidden="true"
                            />
                            {{ item.name }}
                          </router-link>
                        </li>
                      </ul>
                    </li>
                    <li v-if="layoutStore.quickAccessItems.length > 0">
                      <div
                        class="text-xs font-semibold leading-6 text-gray-400"
                      >
                        Schnellzugriff
                      </div>
                      <ul class="-mx-2 mt-2 space-y-1" role="list">
                        <li v-for="item in layoutStore.quickAccessItems" :key="item.name">
                          <router-link
                            :class="[
                              item.path === route.path
                                ? 'bg-gray-50 text-GJDarkGreen'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-GJDarkGreen',
                              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                            ]"
                            :to="item.path"
                          >
                            <span
                              :class="[
                                item.path === route.path
                                  ? 'border-GJDarkGreen text-GJDarkGreen'
                                  : 'border-gray-200 text-gray-400 group-hover:border-GJDarkGreen group-hover:text-GJDarkGreen',
                                'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium',
                              ]"
                              >{{ item.name.substring(0, 2).toLocaleUpperCase() }}</span
                            >
                            <span class="truncate">{{ item.name }}</span>
                          </router-link>
                        </li>
                      </ul>
                    </li>
                    <li class="mt-auto">
                      <router-link
                        class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-GJDarkGreen"
                        to="/settings"
                      >
                        <Cog6ToothIcon
                          aria-hidden="true"
                          class="h-6 w-6 shrink-0 text-gray-400 group-hover:text-GJDarkGreen"
                        />
                        Settings
                      </router-link>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div
      class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col"
    >
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div
        class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4"
      >
        <div class="flex h-16 shrink-0 items-center">
          <img :src="logo" alt="GJ Logo" class="h-8 w-auto" />
        </div>
        <nav class="flex flex-1 flex-col">
          <ul class="flex flex-1 flex-col gap-y-7" role="list">
            <li>
              <ul class="-mx-2 space-y-1" role="list">
                <li v-for="item in navigation" :key="item.name">
                  <router-link
                    :class="[
                      item.to === route.path
                        ? 'bg-gray-50 text-GJDarkGreen'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-GJDarkGreen',
                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                    ]"
                    :to="item.to"
                  >
                    <component
                      :is="item.icon"
                      :class="[
                        item.to === route.path
                          ? 'text-GJDarkGreen'
                          : 'text-gray-400 group-hover:text-GJDarkGreen',
                        'h-6 w-6 shrink-0',
                      ]"
                      aria-hidden="true"
                    />
                    {{ item.name }}
                  </router-link>
                </li>
              </ul>
            </li>
            <li v-if="layoutStore.quickAccessItems.length > 0">
              <div class="text-xs font-semibold leading-6 text-gray-400">
                Schnellzugriff
              </div>
              <ul class="-mx-2 mt-2 space-y-1" role="list">
                <li v-for="item in layoutStore.quickAccessItems" :key="item.name">
                  <router-link
                    :class="[
                      item.path === route.path
                        ? 'bg-gray-50 text-GJDarkGreen'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-GJDarkGreen',
                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                    ]"
                    :to="item.path"
                  >
                    <span
                      :class="[
                        item.path === route.path
                          ? 'border-GJDarkGreen text-GJDarkGreen'
                          : 'border-gray-200 text-gray-400 group-hover:border-GJDarkGreen group-hover:text-GJDarkGreen',
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium',
                      ]"
                      >{{ item.name.substring(0, 2).toLocaleUpperCase() }}</span
                    >
                    <span class="truncate">{{ item.name }}</span>
                  </router-link>
                </li>
              </ul>
            </li>
            <li class="mt-auto">
              <SelectOrganization />
            </li>
            <li>
              <router-link
                class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-GJDarkGreen"
                to="/settings"
              >
                <Cog6ToothIcon
                  aria-hidden="true"
                  class="h-6 w-6 shrink-0 text-gray-400 group-hover:text-GJDarkGreen"
                />
                Einstellungen
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="lg:pl-72">
      <div
        class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8"
      >
        <button
          class="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          type="button"
          @click="sidebarOpen = true"
        >
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon aria-hidden="true" class="h-6 w-6" />
        </button>

        <!-- Separator -->
        <div aria-hidden="true" class="h-6 w-px bg-gray-200 lg:hidden" />

        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <form action="#" class="relative flex flex-1" method="GET">
            <label class="sr-only" for="search-field">Suche</label>
            <MagnifyingGlassIcon
              aria-hidden="true"
              class="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
            />
            <input
              id="search-field"
              class="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
              name="search"
              placeholder="Suche..."
              type="search"
            />
          </form>
          <div class="flex items-center gap-x-4 lg:gap-x-6">
            <button
              class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
              type="button"
            >
              <span class="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" class="h-6 w-6" />
            </button>

            <!-- Separator -->
            <div
              aria-hidden="true"
              class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
            />

            <!-- Profile dropdown -->
            <Menu as="div" class="relative">
              <MenuButton class="-m-1.5 flex items-center p-1.5">
                <span class="sr-only">Open user menu</span>
                <img
                  :src="logoMaybe"
                  alt=""
                  class="h-8 w-8 rounded-full bg-gray-50 object-cover object-top"
                />
                <span class="hidden lg:flex lg:items-center">
                  <span
                    aria-hidden="true"
                    class="ml-4 text-sm font-semibold leading-6 text-gray-900"
                    >Florian Bieck</span
                  >
                  <ChevronDownIcon
                    aria-hidden="true"
                    class="ml-2 h-5 w-5 text-gray-400"
                  />
                </span>
              </MenuButton>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                >
                  <MenuItem
                    v-for="item in userNavigation"
                    :key="item.name"
                    v-slot="{ active }"
                  >
                    <router-link
                      :class="[
                        active ? 'bg-gray-50' : '',
                        'block px-3 py-1 text-sm leading-6 text-gray-900',
                      ]"
                      :to="item.to"
                      >{{ item.name }}
                    </router-link>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>

      <main class="h-[calc(100vh-64px)]">
        <Breadcrumbs class="mb-10" />
        <div class="h-[calc(100%-88px)] px-4 sm:px-6 lg:px-8">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in" appear :duration="75">
              <div class="w-full min-h-full flex items-center justify-items-center" v-if="layoutStore.isPageLoading">
                <RingLoader class="mx-auto" />
              </div>
              <component v-else :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref} from "vue";
import logoMaybe from "../../assets/logomaybe.png";
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  Bars3Icon,
  BellIcon, BuildingOfficeIcon,
  CalendarIcon,
  Cog6ToothIcon,
  CubeIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/vue/20/solid";
import logo from "../../assets/Logo-with-text.png";
import { useRoute } from "vue-router";
import Breadcrumbs from "../Breadcrumbs.vue";
import {useIndexStore} from "../../stores";
import SelectOrganization from "../organizations/SelectOrganization.vue";
import RingLoader from "../RingLoader.vue";
import {useLayoutStore} from "../../stores/layout.ts";

const route = useRoute();
const indexStore = useIndexStore();
const layoutStore = useLayoutStore();

interface MenuItem {
  name: string;
  to: string;
  icon: any;
  show: () => boolean;
}

const unfilteredNavigation = computed<Array<MenuItem>>(() => [
  { name: "Dashboard", to: "/", icon: HomeIcon , show: () => true},
  { name: "Produkte", to: "/products", icon: CubeIcon , show: () => indexStore.selectedOrganization !== null},
  { name: "Statistiken", to: "/stats", icon: FolderIcon , show: () => indexStore.selectedOrganization !== null},
  { name: "Zugriffe", to: "/calendar", icon: CalendarIcon , show: () => indexStore.selectedOrganization !== null},
  { name: "Dateien", to: "/files", icon: DocumentDuplicateIcon , show: () => indexStore.selectedOrganization !== null},
  { name: "Benachrichtigungen", to: "/notifications", icon: BellIcon , show: () => indexStore.selectedOrganization !== null},
  { name: "Users", to: "/users", icon: UsersIcon , show: () => indexStore.selectedOrganization !== null},
  {name: 'Organisation auswählen', to: '/organizations', icon: BuildingOfficeIcon, show: () => indexStore.selectedOrganization === null},
]);
const navigation = computed<Array<MenuItem>>(() => unfilteredNavigation.value.filter(item => item.show()));
const userNavigation = [
  { name: "Dein Profil", to: "/profile" },
  { name: "Abmelden", to: "/logout" },
];

const sidebarOpen = ref(false);
</script>
