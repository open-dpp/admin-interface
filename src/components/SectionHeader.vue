<template>
  <div
    class="flex justify-between items-center border-b border-gray-900/5 bg-gray-50"
  >
    <div class="flex items-center gap-2">
      <div
        :class="[
          props.section.type === SectionType.REPEATABLE
            ? 'bg-pink-500'
            : 'bg-indigo-500',
          'flex size-16 items-center justify-center',
        ]"
      >
        <component
          :is="
            props.section.type === SectionType.REPEATABLE
              ? ArrowPathIcon
              : TableCellsIcon
          "
          class="size-6 text-white"
          aria-hidden="true"
        />
      </div>
      <div class="text-sm/6 font-medium text-gray-900">
        {{ props.section.name }}
      </div>
    </div>
    <button
      v-if="
        !props.disabled &&
        props.section.type === SectionType.REPEATABLE &&
        !props.isDraftView
      "
      class="m-2 block rounded-md bg-indigo-600 px-3 py-1.5 text-center text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      type="button"
      @click="onAddRow"
    >
      Datenreihe hinzufügen
    </button>
    <div v-if="props.disabled">Wird auf Artikelebene gesetzt</div>
  </div>
</template>

<script setup lang="ts">
import { ArrowPathIcon, TableCellsIcon } from "@heroicons/vue/24/outline";
import { SectionDto, SectionType } from "@open-dpp/api-client";
import { useModelFormStore } from "../stores/model.form";

const props = defineProps<{
  section: SectionDto;
  isDraftView: boolean;
  disabled: boolean;
}>();

const modelFormStore = useModelFormStore();

const onAddRow = async () => {
  await modelFormStore.addRowToSection(props.section.id);
};
</script>
