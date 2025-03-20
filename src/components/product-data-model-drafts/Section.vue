<template>
  <div
    v-if="draftStore.draft"
    class="overflow-hidden rounded-lg bg-white shadow"
  >
    <div class="flex flex-col gap-4">
      <div
        class="flex justify-between items-center border-b border-gray-900/5 bg-gray-50"
      >
        <div class="flex items-center gap-2">
          <div
            :class="[
              props.section.type === SectionType.REPEATABLE
                ? 'bg-pink-500'
                : 'bg-indigo-500',
              'flex size-13 items-center justify-center',
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
        <div class="flex gap-x-6 p-4">
          <router-link
            :to="`/organizations/${indexStore.selectedOrganization}/data-model-drafts/${draftStore.draft.id}/sections/${section.id}`"
            data-cy="editSection"
          >
            <PencilIcon class="size-5 fill-indigo-300" aria-hidden="true" />
          </router-link>
          <button @click="onDelete" type="button" data-cy="deleteSection">
            <TrashIcon class="size-5 fill-red-300" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div class="flex flex-col p-2">
        <AddDataField :section-id="props.section.id" />
        <div class="divide-y divide-gray-100">
          <DataField
            v-for="dataField in props.section.dataFields"
            :section-id="section.id"
            :data-field="dataField"
            :key="dataField.id"
            class="gap-2 p-2"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SectionDraftDto, SectionType } from "@open-dpp/api-client";

import { ArrowPathIcon, TableCellsIcon } from "@heroicons/vue/24/outline";
import AddDataField from "./AddDataField.vue";
import { useDraftStore } from "../../stores/draft";
import DataField from "./DataField.vue";
import { PencilIcon, TrashIcon } from "@heroicons/vue/20/solid";
import { useIndexStore } from "../../stores";

const props = defineProps<{ section: SectionDraftDto }>();
const draftStore = useDraftStore();
const indexStore = useIndexStore();

const onDelete = async () => {
  await draftStore.deleteSection(props.section.id);
};
</script>
