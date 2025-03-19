<template>
  <div class="flex justify-between gap-x-4 py-3">
    <div class="text-gray-500">{{ props.dataField.name }}</div>
    <div class="flex shrink-0 items-center gap-x-6">
      <div class="text-gray-700">
        <span
          class="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
          >Textfeld</span
        >
      </div>
      <button type="button" data-cy="editDataField">
        <PencilIcon class="size-5 fill-indigo-300" aria-hidden="true" />
      </button>
      <button type="button" @click="onDelete" data-cy="deleteDataField">
        <TrashIcon class="size-5 fill-red-300" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrashIcon, PencilIcon } from "@heroicons/vue/20/solid";
import { DataFieldDraftDto } from "../../../../open-dpp-api-client";
import { useDraftStore } from "../../stores/draft";

const props = defineProps<{
  dataField: DataFieldDraftDto;
}>();
const draftStore = useDraftStore();

const onDelete = async () => {
  await draftStore.deleteDataField(props.dataField.id);
};
</script>
