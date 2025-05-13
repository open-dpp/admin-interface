<template>
  <button
    v-if="!showAddDataField"
    class="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    type="button"
    @click="showAddDataField = true"
  >
    <PlusCircleIcon aria-hidden="true" class="-ml-0.5 size-5" />
    Datenfeld hinzufügen
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
            class="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            type="button"
            @click="showAddDataField = false"
          >
            <span class="absolute -inset-2.5" />
            <span class="sr-only">Close panel</span>
            <XMarkIcon aria-hidden="true" class="size-6" />
          </button>
        </div>
      </div>
      <ul
        class="grid grid-cols-1 gap-6 border-b border-t border-gray-200 py-6 sm:grid-cols-2"
        role="list"
      >
        <li
          v-for="(item, itemIdx) in items"
          :key="itemIdx"
          class="flow-root"
          @click="onSelect(item)"
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
                aria-hidden="true"
                class="size-6 text-white"
              />
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-900">
                <a class="focus:outline-none" href="#">
                  <span aria-hidden="true" class="absolute inset-0" />
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
        id="createDataFieldForm"
        :actions="false"
        class="flex flex-row"
        type="form"
        @submit="create"
      >
        <form-kit
          data-cy="name"
          help="Geben Sie Ihrem Datenfeld einen Namen"
          label="Name"
          name="name"
          outer-class="w-full"
          type="text"
          validation="required"
        />
        <div v-if="selectedOptions !== null">
          <form-kit
            v-for="(option, optionIdx) in selectedOptions"
            :key="optionIdx"
            :help="`Option ${optionIdx}: ${option}`"
            :label="`Option ${optionIdx}: ${option}`"
            :name="`option-${optionIdx}`"
            data-cy="options"
            outer-class="w-full"
            type="text"
            validation="required"
          />
        </div>

        <form-kit class="w-full" label="Erstellen" type="submit" />
      </form-kit>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  Bars3BottomLeftIcon,
  HashtagIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { DataFieldType } from "@open-dpp/api-client";
import { type FunctionalComponent, ref } from "vue";

import { reset } from "@formkit/core";
import { useDraftStore } from "../../stores/draft";

const props = defineProps<{ sectionId: string }>();
const draftStore = useDraftStore();

const showAddDataField = ref<boolean>(false);

const selectedType = ref<DataFieldType>(DataFieldType.TEXT_FIELD);
const selectedOptions = ref<Record<string, unknown> | null>(null);

interface DataFieldAddInterface {
  title: string;
  description: string;
  icon: FunctionalComponent;
  background: string;
  type: DataFieldType;
  options?: Record<string, unknown>;
}

const items: Array<DataFieldAddInterface> = [
  {
    title: "TextFeld",
    description: "Fügen Sie ein Textfeld hinzu",
    icon: Bars3BottomLeftIcon,
    background: "bg-indigo-500",
    type: DataFieldType.TEXT_FIELD,
  },
  {
    title: "Numerisches Feld",
    description: "Fügen Sie ein numerisches Feld hinzu",
    icon: HashtagIcon,
    background: "bg-pink-500",
    type: DataFieldType.NUMERIC_FIELD,
    options: {
      min: 0,
      max: 100,
    },
  },
];

const onSelect = (dataField: DataFieldAddInterface) => {
  selectedType.value = dataField.type;
  selectedOptions.value = dataField.options ?? null;
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
