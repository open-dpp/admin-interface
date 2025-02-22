<template>
  <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
    <FormKit
      v-bind="attrs"
      :data-cy="props.id"
      inner-class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
    />
  </div>
</template>

<script setup lang="ts">
import { useAttrs } from "vue";

const props = defineProps<{ id: string }>();

const attrs = useAttrs();
</script>
