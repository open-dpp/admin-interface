<template>
  <ul
    role="list"
    class="flex flex-col gap-6 border-b border-t border-gray-200 p-6"
  >
    <li
      v-for="(item, itemIdx) in itemsToSelect"
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
</template>

<script setup lang="ts">
import {
  type FunctionalComponent,
  type HTMLAttributes,
  ref,
  type VNodeProps,
  watch,
} from "vue";
import { DataFieldType, SectionType } from "@open-dpp/api-client";
import { ArrowPathIcon, TableCellsIcon } from "@heroicons/vue/24/outline";
import {
  SidebarContentType,
  useDraftSidebarStore,
} from "../../stores/draftSidebar";

const selectedType = ref<string>(SectionType.GROUP);

const props = defineProps<{ parentId?: string }>();

const draftSidebarStore = useDraftSidebarStore();

type SelectOption = {
  title: string;
  description: string;
  icon: FunctionalComponent<HTMLAttributes & VNodeProps>;
  background: string;
  type: string;
};

const sections: SelectOption[] = [
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

const itemsToSelect = ref<SelectOption[]>([]);

const dataFields: SelectOption[] = [
  {
    title: "Textfeld",
    description: "Fügen Sie Textfeld hinzu",
    icon: ArrowPathIcon,
    background: "bg-pink-500",
    type: DataFieldType.TEXT_FIELD,
  },
];

watch(
  () => props.parentId, // The store property to watch
  () => {
    if (props.parentId) {
      itemsToSelect.value = [...sections, ...dataFields];
    } else {
      itemsToSelect.value = sections;
    }
  },
  { immediate: true }, // Optional: to run the watcher immediately when the component mounts
);

const onSelect = (type: string) => {
  selectedType.value = type;
  draftSidebarStore.setContentWithProps(SidebarContentType.NODE_FORM, {
    type,
    parentId: props.parentId,
  });
};
</script>
