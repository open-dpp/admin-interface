<template>
  <div :class="[generateClassesForLayout(dataField.layout)]">
    <input
      v-if="props.dataField.type === DataFieldType.TEXT_FIELD"
      :placeholder="dataField.name"
      class="block w-full cursor-pointer select-none rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
      readonly
      type="text"
      @mousedown.prevent="onClicked"
    />
    <input
      v-else-if="props.dataField.type === DataFieldType.NUMERIC_FIELD"
      :placeholder="dataField.name"
      class="block w-full cursor-pointer select-none rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
      readonly
      type="text"
      @mousedown.prevent="onClicked"
    />
  </div>
</template>

<script lang="ts" setup>
import { DataFieldDto, DataFieldType } from "@open-dpp/api-client";
import { generateClassesForLayout } from "../../lib/layout";
import {
  SidebarContentType,
  useDraftSidebarStore,
} from "../../stores/draftSidebar";

const props = defineProps<{ dataField: DataFieldDto }>();

const draftSidebarStore = useDraftSidebarStore();

const onClicked = () => {
  draftSidebarStore.open(SidebarContentType.DATA_FIELD_FORM, {
    type: props.dataField.type,
    layout: props.dataField.layout,
    id: props.dataField.id,
  });
};
</script>
