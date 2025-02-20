<script setup lang="ts">
const props = defineProps<{ label: string }>();
</script>

<template>
  <div class="overflow-hidden bg-white shadow sm:rounded-lg">
    <div class="px-4 py-6 sm:px-6">
      <h3 class="text-base/7 font-semibold text-gray-900">
        {{ `Abschnitt ${props.label}` }}
      </h3>
    </div>
    <slot class="flex-auto gap-3"></slot>
  </div>
</template>

<style scoped></style>
