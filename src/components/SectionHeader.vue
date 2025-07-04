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
        !disabledMessage &&
        props.section.type === SectionType.REPEATABLE &&
        !props.isDraftView
      "
      class="m-2 block rounded-md bg-indigo-600 px-3 py-1.5 text-center text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      type="button"
      @click="onAddRow"
    >
      Datenreihe hinzufügen
    </button>
    <div class="m-2 text-sm/6 font-medium text-gray-900" v-if="disabledMessage">
      {{ disabledMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowPathIcon, TableCellsIcon } from "@heroicons/vue/24/outline";
import { SectionDto, SectionType } from "@open-dpp/api-client";
import { usePassportFormStore } from "../stores/passport.form";
import { computed } from "vue";

const props = defineProps<{
  section: SectionDto;
  isDraftView: boolean;
}>();

const passportFormStore = usePassportFormStore();

const disabledMessage = computed(() => {
  if (
    props.section.granularityLevel &&
    props.section.granularityLevel !== passportFormStore.granularityLevel
  ) {
    return passportFormStore.getValueForOtherGranularityLevel();
  }
  return undefined;
});

const onAddRow = async () => {
  await passportFormStore.addRowToSection(props.section.id);
};
</script>
