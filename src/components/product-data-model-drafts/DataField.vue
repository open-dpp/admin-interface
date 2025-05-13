<template>
  <div class="flex justify-between gap-x-4 py-3">
    <div class="text-gray-500">{{ props.dataField.name }}</div>
    <div class="flex shrink-0 items-center gap-x-6">
      <div class="text-gray-700">
        <span
          class="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
          >{{ typeLabel }}</span
        >
      </div>
      <router-link
        :to="`/organizations/${indexStore.selectedOrganization}/data-model-drafts/${draftStore.draft?.id}/sections/${props.sectionId}/data-fields/${dataField.id}`"
        data-cy="editDataField"
        type="button"
      >
        <PencilIcon aria-hidden="true" class="size-5 fill-indigo-300" />
      </router-link>
      <button data-cy="deleteDataField" type="button" @click="onDelete">
        <TrashIcon aria-hidden="true" class="size-5 fill-red-300" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PencilIcon, TrashIcon } from "@heroicons/vue/20/solid";
import { DataFieldDraftDto, DataFieldType } from "@open-dpp/api-client";
import { useDraftStore } from "../../stores/draft";
import { useIndexStore } from "../../stores";
import { computed } from "vue";

const props = defineProps<{
  sectionId: string;
  dataField: DataFieldDraftDto;
}>();
const indexStore = useIndexStore();
const draftStore = useDraftStore();

const onDelete = async () => {
  await draftStore.deleteDataField(props.dataField.id);
};

const typeLabel = computed(() => {
  switch (props.dataField.type) {
    case DataFieldType.TEXT_FIELD:
      return "Textfeld";
    case DataFieldType.NUMERIC_FIELD:
      return "Nummerisch";
    default:
      return "Datenfeld";
  }
});
</script>
