<template>
  <button
    v-if="!showAddSection"
    @click="showAddSection = true"
    type="button"
    class="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
  >
    <PlusCircleIcon class="-ml-0.5 size-5" aria-hidden="true" /> Abschnitt
    hinzufügen
  </button>
  <div v-if="showAddSection" class="overflow-hidden rounded-lg bg-white shadow">
    <div class="flex flex-col gap-4 px-4 py-5 sm:p-6">
      <div class="flex items-start justify-between">
        <h2 class="text-base font-semibold text-gray-900">
          Abschnitt hinzufügen
        </h2>
        <div class="ml-3 flex h-7 items-center">
          <button
            type="button"
            class="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            @click="showAddSection = false"
          >
            <span class="absolute -inset-2.5" />
            <span class="sr-only">Close panel</span>
            <XMarkIcon class="size-6" aria-hidden="true" />
          </button>
        </div>
      </div>
      <ul
        role="list"
        class="mt-6 grid grid-cols-1 gap-6 border-b border-t border-gray-200 py-6 sm:grid-cols-2"
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
        id="createSectionForm"
        :actions="false"
        type="form"
        @submit="create"
      >
        <form-kit
          outer-class="w-full"
          data-cy="name"
          help="Geben Sie Ihrem Abschnitt einen Namen"
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
  ArrowPathIcon,
  TableCellsIcon,
  XMarkIcon,
  PlusCircleIcon,
} from "@heroicons/vue/24/outline";
import { SectionType } from "@open-dpp/api-client";
import { ref } from "vue";

import { reset } from "@formkit/core";
import { useDraftStore } from "../../stores/draft";

const showAddSection = ref<boolean>(false);
const draftStore = useDraftStore();
const selectedType = ref<SectionType>(SectionType.GROUP);

const items = [
  {
    title: "Gruppierung",
    description:
      "Fügen Sie einen Abschnitt hinzu, der mehrere Felder gruppiert",
    icon: TableCellsIcon,
    background: "bg-indigo-500",
    type: SectionType.GROUP,
  },
  {
    title: "Repeater",
    description:
      "Fügen Sie einen Repeater Abschnitt hinzu, um eine Gruppe von Feldern beliebig oft hinzuzufügen zu können.",
    icon: ArrowPathIcon,
    background: "bg-pink-500",
    type: SectionType.REPEATABLE,
  },
];

const onSelect = (type: SectionType) => {
  selectedType.value = type;
};

const create = async (fields: { name: string }) => {
  await draftStore.addSection({
    name: fields.name,
    type: selectedType.value,
  });
  showAddSection.value = false;
  reset("createSectionForm");
};
</script>
