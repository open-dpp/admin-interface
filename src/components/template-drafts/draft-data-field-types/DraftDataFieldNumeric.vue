<template>
  <input
    :placeholder="dataField.name"
    :aria-label="dataField.name"
    role="button"
    tabindex="0"
    class="block w-full cursor-pointer select-none rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
    readonly
    type="text"
    @click="emits('clicked')"
    @keydown.enter.prevent="emits('clicked')"
    @keydown.space.prevent="emits('clicked')"
  />
</template>
<script lang="ts" setup>
import { DataFieldDto } from "@open-dpp/api-client";

defineProps<{ dataField: DataFieldDto }>();

const emits = defineEmits<{
  (e: "clicked"): void;
}>();
</script>
