<template>
  <div
    v-if="draftStore.draft"
    class="overflow-hidden rounded-lg bg-white shadow"
  >
    <div class="flex flex-col px-4 py-5 sm:p-6 gap-4">
      <div
        class="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6"
      >
        <div
          :class="[
            props.section.type === SectionType.REPEATABLE
              ? 'bg-pink-500'
              : 'bg-indigo-500',
            'flex size-12 shrink-0 items-center justify-center rounded-lg',
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
      <AddDataField :section-id="props.section.id" />
      <dl
        v-for="dataField in props.section.dataFields"
        :key="dataField.id"
        class="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm/6"
      >
        <div class="flex justify-between gap-x-4 py-3">
          <dt class="text-gray-500">{{ dataField.name }}</dt>
          <dd class="text-gray-700">
            <span
              class="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
              >Textfeld</span
            >
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SectionDraftDto, SectionType } from "@open-dpp/api-client";
import { ArrowPathIcon, TableCellsIcon } from "@heroicons/vue/24/outline";
import AddDataField from "./AddDataField.vue";
import { useDraftStore } from "../../stores/draft";

const props = defineProps<{ section: SectionDraftDto }>();
const draftStore = useDraftStore();
</script>
