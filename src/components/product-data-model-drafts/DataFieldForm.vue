<template>
  <div class="p-4">
    <FormKit
      id="repeatable-form"
      v-model="formData"
      :actions="false"
      type="form"
      @submit="onSubmit"
    >
      <FormKitSchema v-if="formSchema" :schema="formSchema" />
      <div class="flex gap-2">
        <!--        "grow": true,-->
        <!--        "max-w-[20em]": true,-->
        <!--        "min-w-0": true,-->
        <!--        "text-base": true,-->
        <!--        "mb-4": true,-->
        <!--        "data-disabled:select-none": true,-->
        <!--        "data-disabled:opacity-50": true,-->
        <!--        "data-disabled:pointer-events-none": true,-->
        <button
          class="block rounded-md bg-indigo-600 px-3 py-1.5 text-center text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          data-cy="submit"
          type="submit"
        >
          {{ dataFieldToModify ? "Ändern" : "Hinzufügen" }}
        </button>
        <button
          v-if="dataFieldToModify"
          class="block rounded-md bg-red-600 px-3 py-1.5 text-center text-sm/6 font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-red-600"
          data-cy="delete"
          type="button"
          @click="onDelete"
        >
          Datenfeld löschen
        </button>
      </div>
    </FormKit>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { DataFieldDto, DataFieldType, LayoutDto } from "@open-dpp/api-client";
import { useDraftStore } from "../../stores/draft";
import { z } from "zod";
import { useDraftSidebarStore } from "../../stores/draftSidebar";
import {
  NotificationType,
  useNotificationStore,
} from "../../stores/notification";

const props = defineProps<{
  type: DataFieldType;
  parentId?: string;
  layout: LayoutDto;
  id?: string;
}>();

const formData = ref<Record<string, unknown>>({});
const formSchema = ref();
const dataFieldToModify = ref<DataFieldDto | undefined>();
const draftStore = useDraftStore();
const draftSidebarStore = useDraftSidebarStore();

const formSchemaFromType = (type: string) => {
  // const colOptions = Object.fromEntries(
  //   Array.from({ length: 12 }, (_, i) => [i + 1, (i + 1).toString()]),
  // );

  switch (type) {
    case DataFieldType.TEXT_FIELD:
      return [
        {
          $formkit: "text",
          name: "name",
          label: "Name des Textfeldes",
          "data-cy": "name",
        },
      ];

    default:
      console.warn(`Unsupported node type: ${type}, using generic form`);
      return [];
  }
};

watch(
  [() => props.type, () => props.id], // The store property to watch
  ([newType, newId]) => {
    formSchema.value = formSchemaFromType(newType);
    if (newId) {
      dataFieldToModify.value = draftStore.findDataField(newId);
      formData.value = { name: dataFieldToModify.value?.name };
      // Add type-specific form data initialization if needed
    }
  },
  { immediate: true, deep: true }, // Optional: to run the watcher immediately when the component mounts
);

const onDelete = async () => {
  if (dataFieldToModify.value) {
    await draftStore.deleteDataField(dataFieldToModify.value.id);
    draftSidebarStore.close();
  }
};

const onSubmit = async () => {
  const data = z.object({ name: z.string() }).parse(formData.value);
  if (dataFieldToModify.value) {
    await draftStore.modifyDataField(dataFieldToModify.value.id, {
      name: data.name,
      layout: dataFieldToModify.value.layout,
    });
  } else if (props.parentId) {
    await draftStore.addDataField(props.parentId, {
      type: props.type,
      name: data.name,
      layout: props.layout,
    });
  } else {
    const notificationStore = useNotificationStore();
    notificationStore.addNotification(
      "Datenfeld konnte nicht hinzugefügt werden.",
      NotificationType.ERROR,
    );
  }

  draftSidebarStore.close();
};
</script>
