<template>
  <button
    v-bind="props"
    :type="props.type"
    :class="[
      colorClasses,
      'm-2 block rounded-md px-3 py-1.5 text-center text-sm/6 font-semibold text-white shadow-xs focus-visible:outline focus-visible:outline-offset-2',
    ]"
    @click="emits('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "primary" | "error";
}>();

const colorClasses = computed(() => {
  const defaultColors =
    "bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600";
  switch (props.variant) {
    case "primary":
      return defaultColors;
    case "error":
      return "bg-red-600 hover:bg-red-500 focus-visible:outline-red-600";
    default:
      return defaultColors;
  }
});
const emits = defineEmits<{
  click: [event: MouseEvent];
}>();
</script>
