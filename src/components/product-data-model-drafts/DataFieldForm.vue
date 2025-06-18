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
import {
  DataFieldDto,
  DataFieldType,
  GranularityLevel,
  LayoutDto,
} from "@open-dpp/api-client";
import { useDraftStore } from "../../stores/draft";
import { z } from "zod";
import { useDraftSidebarStore } from "../../stores/draftSidebar";
import { useNotificationStore } from "../../stores/notification";

const props = defineProps<{
  type: DataFieldType;
  parentId?: string;
  parentGranularityLevel?: GranularityLevel;
  layout: LayoutDto;
  id?: string;
}>();

const formData = ref<Record<string, unknown>>({});
const formSchema = ref();
const dataFieldToModify = ref<DataFieldDto | undefined>();
const draftStore = useDraftStore();
const draftSidebarStore = useDraftSidebarStore();

const formSchemaFromType = (
  type: string,
  existingGranularityLevel: GranularityLevel | undefined,
) => {
  const granularityOptions = {
    [GranularityLevel.MODEL]: "Produktmodellebene",
    [GranularityLevel.ITEM]: "Artikelebene",
  };
  const dataFieldFormkitSchema = [];

  switch (type) {
    case DataFieldType.TEXT_FIELD:
      dataFieldFormkitSchema.push({
        $formkit: "text",
        name: "name",
        label: "Name des Textfeldes",
        "data-cy": "name",
      });
      break;
    case DataFieldType.PRODUCT_PASSPORT_LINK:
      dataFieldFormkitSchema.push({
        $formkit: "text",
        name: "name",
        label: "Name der Produktpass Verlinkung",
        "data-cy": "name",
      });
      break;
    default:
      console.warn(
        `[DataFieldForm] Unsupported node type: ${type}, using generic form. Please implement a form schema for this type.`,
      );
  }
  if (!existingGranularityLevel) {
    dataFieldFormkitSchema.push({
      $formkit: "select",
      name: "granularityLevel",
      label: "Granularitätsebene",
      options: granularityOptions,
      "data-cy": "select-granularity-level",
    });
  }
  return dataFieldFormkitSchema;
};

watch(
  [() => props.type, () => props.id], // The store property to watch
  ([newType, newId]) => {
    const dataField = newId ? draftStore.findDataField(newId) : undefined;
    formSchema.value = formSchemaFromType(
      newType,
      dataField?.granularityLevel ?? props.parentGranularityLevel,
    );
    if (dataField) {
      dataFieldToModify.value = dataField;
      formData.value = {
        name: dataFieldToModify.value.name,
        granularityLevel: dataFieldToModify.value.granularityLevel,
      };
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
  const data = z
    .object({
      name: z.string(),
      granularityLevel: z.nativeEnum(GranularityLevel),
    })
    .parse({
      granularityLevel: props.parentGranularityLevel,
      ...formData.value,
    });
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
      granularityLevel: data.granularityLevel,
    });
  } else {
    const notificationStore = useNotificationStore();
    notificationStore.addErrorNotification(
      "Datenfeld konnte nicht hinzugefügt werden.",
    );
  }

  draftSidebarStore.close();
};
</script>
