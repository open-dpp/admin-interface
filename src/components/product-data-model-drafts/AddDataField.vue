<template>
  <button
    v-if="!showAddDataField"
    @click="showAddDataField = true"
    type="button"
    class="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
  >
    <PlusCircleIcon class="-ml-0.5 size-5" aria-hidden="true" /> Datenfeld
    hinzufügen
  </button>
  <div
    v-if="showAddDataField"
    class="overflow-hidden rounded-lg bg-white shadow"
  >
    <div class="flex flex-col gap-4 px-4 py-5 sm:p-6">
      <div class="flex items-start justify-between">
        <h2 class="text-base font-semibold text-gray-900">
          Datenfeld hinzufügen
        </h2>
        <div class="ml-3 flex h-7 items-center">
          <button
            type="button"
            class="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            @click="showAddDataField = false"
          >
            <span class="absolute -inset-2.5" />
            <span class="sr-only">Close panel</span>
            <XMarkIcon class="size-6" aria-hidden="true" />
          </button>
        </div>
      </div>
      <ul
        role="list"
        class="grid grid-cols-1 gap-6 border-b border-t border-gray-200 py-6 sm:grid-cols-2"
      >
        <li
          v-for="(item, itemIdx) in items"
          :key="itemIdx"
          class="flow-root"
          @click="onSelect(item.type)"
        >
          <div
            :class="[
              selectedType === item.type && 'ring-indigo-500 rounded-xl ring-2',
              'relative -m-2 flex items-center space-x-4 p-2 hover:bg-gray-50',
            ]"
          >
            <div
              :class="[
                item.background,
                'flex size-16 shrink-0 items-center justify-center rounded-lg',
              ]"
            >
              <component
                :is="item.icon"
                class="size-6 text-white"
                aria-hidden="true"
              />
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-900">
                <a href="#" class="focus:outline-none">
                  <span class="absolute inset-0" aria-hidden="true" />
                  <span>{{ item.title }}</span>
                  <span aria-hidden="true"> &rarr;</span>
                </a>
              </h3>
              <p class="mt-1 text-sm text-gray-500">{{ item.description }}</p>
            </div>
          </div>
        </li>
      </ul>
      <form-kit
        class="flex flex-row"
        id="createDataFieldForm"
        :actions="false"
        type="form"
        @submit="create"
      >
        <form-kit
          outer-class="w-full"
          data-cy="name"
          help="Geben Sie Ihrem Datenfeld einen Namen"
          label="Name"
          name="name"
          type="text"
          validation="required"
        />
        <form-kit class="w-full" label="Erstellen" type="submit" />
      </form-kit>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  PlusCircleIcon,
  XMarkIcon,
  Bars3BottomLeftIcon,
} from "@heroicons/vue/24/outline";
import { DataFieldType } from "@open-dpp/api-client";
import { ref } from "vue";

import { reset } from "@formkit/core";
import { useDraftStore } from "../../stores/draft";

const props = defineProps<{ sectionId: string }>();
const draftStore = useDraftStore();

const showAddDataField = ref<boolean>(false);

const selectedType = ref<DataFieldType>(DataFieldType.TEXT_FIELD);

const items = [
  {
    title: "TextFeld",
    description: "Fügen Sie ein Textfeld hinzu",
    icon: Bars3BottomLeftIcon,
    background: "bg-indigo-500",
    type: DataFieldType.TEXT_FIELD,
  },
];

const onSelect = (type: DataFieldType) => {
  selectedType.value = type;
};

const create = async (fields: { name: string }) => {
  await draftStore.addDataField(props.sectionId, {
    name: fields.name,
    type: selectedType.value,
  });
  showAddDataField.value = false;
  reset("createDataFieldForm");
};
</script>
