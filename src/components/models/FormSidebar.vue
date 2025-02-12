<template>
  <TransitionRoot :show="showSidebar" as="template">
    <Dialog class="relative z-20" @close="closeSidebar">
      <div class="fixed inset-0" />

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div
            class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16 pt-12"
          >
            <TransitionChild
              as="template"
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enter-from="translate-x-full"
              enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leave-from="translate-x-0"
              leave-to="translate-x-full"
            >
              <DialogPanel class="pointer-events-auto w-screen max-w-md">
                <form
                  class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
                  @submit.prevent="handleSubmit"
                >
                  <div class="h-0 flex-1 overflow-y-auto">
                    <div class="bg-indigo-700 px-4 py-6 sm:px-6">
                      <div class="flex items-center justify-between">
                        <DialogTitle
                          class="text-base font-semibold text-white"
                          >{{ props.dialogTitle }}</DialogTitle
                        >
                        <div class="ml-3 flex h-7 items-center">
                          <button
                            class="relative rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                            type="button"
                            @click="closeSidebar"
                          >
                            <span class="absolute -inset-2.5" />
                            <span class="sr-only">Close panel</span>
                            <XMarkIcon aria-hidden="true" class="h-6 w-6" />
                          </button>
                        </div>
                      </div>
                      <div class="mt-1">
                        <p class="text-sm text-indigo-300">
                          Füge dein erstes Modell hinzu.
                        </p>
                      </div>
                    </div>
                    <slot></slot>
                  </div>
                  <div class="flex flex-shrink-0 justify-end px-4 py-4">
                    <button
                      class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      type="button"
                      @click="closeSidebar"
                    >
                      Abbrechen
                    </button>
                    <button
                      class="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      type="submit"
                    >
                      Speichern
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts" setup>
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
const emit = defineEmits(["formSubmitted"]);
const showSidebar = defineModel<boolean>();
const props = defineProps<{ dialogTitle: string }>();

function closeSidebar() {
  showSidebar.value = false;
}

function handleSubmit() {
  emit("formSubmitted");
}
</script>
