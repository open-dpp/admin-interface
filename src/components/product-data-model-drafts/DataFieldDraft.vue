<template>
  <div :class="[generateClassesForLayout(dataField.layout)]">
    <input
      v-if="props.dataField.type === DataFieldType.TEXT_FIELD"
      class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      disabled
      :placeholder="dataField.name"
      type="text"
    />
  </div>
</template>

<script setup lang="ts">
import { DataFieldDto, DataFieldType } from "@open-dpp/api-client";
import { generateClassesForLayout } from "../../lib/layout";

const props = defineProps<{ dataField: DataFieldDto }>();
</script>
