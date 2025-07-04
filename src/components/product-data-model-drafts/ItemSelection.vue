<template>
  <ul
    class="flex flex-col gap-6 border-b border-t border-gray-200 p-6"
    role="list"
  >
    <li
      v-for="(item, itemIdx) in itemsToSelect"
      :key="itemIdx"
      class="flow-root"
      @click="onSelect(item.type, item.sidebarType)"
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
</template>

<script lang="ts" setup>
import {
  type FunctionalComponent,
  type HTMLAttributes,
  ref,
  type VNodeProps,
  watch,
} from "vue";
import {
  DataFieldType,
  GranularityLevel,
  LayoutDto,
  SectionType,
} from "@open-dpp/api-client";
import {
  ArrowPathIcon,
  ChartBarSquareIcon,
  TableCellsIcon,
} from "@heroicons/vue/24/outline";
import {
  SidebarContentType,
  useDraftSidebarStore,
} from "../../stores/draftSidebar";
import { LinkIcon } from "@heroicons/vue/16/solid";

const selectedType = ref<string>(SectionType.GROUP);

const props = defineProps<{
  parentId?: string;
  parentGranularityLevel?: GranularityLevel;
  layout: LayoutDto;
}>();

const draftSidebarStore = useDraftSidebarStore();

type SelectOption = {
  title: string;
  description: string;
  icon: FunctionalComponent<HTMLAttributes & VNodeProps>;
  background: string;
  type: string;
  sidebarType: SidebarContentType;
};

const repeater: SelectOption = {
  title: "Repeater",
  description:
    "Fügen Sie einen Repeater Abschnitt hinzu, um eine Gruppe von Feldern beliebig oft hinzuzufügen zu können.",
  icon: ArrowPathIcon,
  background: "bg-pink-500",
  type: SectionType.REPEATABLE,
  sidebarType: SidebarContentType.SECTION_FORM,
};
const group: SelectOption = {
  title: "Gruppierung",
  description: "Fügen Sie einen Abschnitt hinzu, der mehrere Felder gruppiert",
  icon: TableCellsIcon,
  background: "bg-indigo-500",
  type: SectionType.GROUP,
  sidebarType: SidebarContentType.SECTION_FORM,
};

const itemsToSelect = ref<SelectOption[]>([]);

const dataFields: SelectOption[] = [
  {
    title: "Textfeld",
    description: "Fügen Sie Textfeld hinzu",
    icon: ArrowPathIcon,
    background: "bg-pink-500",
    type: DataFieldType.TEXT_FIELD,
    sidebarType: SidebarContentType.DATA_FIELD_FORM,
  },
  {
    title: "Produktpass Verlinkung",
    description: "Fügen Sie eine Verlinkung zu einem Produktpass hinzu",
    icon: LinkIcon,
    background: "bg-green-500",
    type: DataFieldType.PRODUCT_PASSPORT_LINK,
    sidebarType: SidebarContentType.DATA_FIELD_FORM,
  },
  {
    title: "Numerisches Feld",
    description: "Fügen Sie ein numerisches Feld hinzu",
    icon: ChartBarSquareIcon,
    background: "bg-teal-500",
    type: DataFieldType.NUMERIC_FIELD,
    sidebarType: SidebarContentType.DATA_FIELD_FORM,
  },
];

watch(
  () => props.parentId, // The store property to watch
  () => {
    if (props.parentId) {
      itemsToSelect.value = [group, ...dataFields];
    } else {
      itemsToSelect.value = [group, repeater];
    }
  },
  { immediate: true }, // Optional: to run the watcher immediately when the component mounts
);

const onSelect = (type: string, sidebarType: SidebarContentType) => {
  selectedType.value = type;
  draftSidebarStore.setContentWithProps(sidebarType, {
    type,
    parentId: props.parentId,
    layout: props.layout,
    parentGranularityLevel: props.parentGranularityLevel,
  });
};
</script>
