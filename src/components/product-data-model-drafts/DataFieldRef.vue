<template>
  <div
    class="flex flex-col w-full items-center justify-center rounded-lg p-1 border-2 border-dashed border-gray-300 h-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
  >
    <input
      v-if="dataField && dataField.type === DataFieldType.TEXT_FIELD"
      class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      disabled
      :placeholder="dataField.name"
      type="text"
    />
  </div>
</template>
<script setup lang="ts">
import { DataFieldRefDto, DataFieldType } from "@open-dpp/api-client";
import { useDraftStore } from "../../stores/draft";
import { computed } from "vue";

const props = defineProps<{ dataFieldRef: DataFieldRefDto }>();

const draftStore = useDraftStore();

const dataField = computed(() => {
  return draftStore.findDataField(props.dataFieldRef.fieldId);
});
</script>
