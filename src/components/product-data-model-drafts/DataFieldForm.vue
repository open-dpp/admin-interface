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
      <FormKit
        v-if="dataFieldToModify"
        data-cy="submit"
        label="Ändern"
        type="submit"
      />
      <FormKit v-else data-cy="submit" label="Hinzufügen" type="submit" />
    </FormKit>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { DataFieldDto, DataFieldType, LayoutDto } from "@open-dpp/api-client";
import { useDraftStore } from "../../stores/draft";
import { z } from "zod";
import { useDraftSidebarStore } from "../../stores/draftSidebar";

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
      throw new Error(`Unsupported node type: ${type}`);
  }
};

watch(
  [() => props.type, () => props.id], // The store property to watch
  ([newType, newId]) => {
    formSchema.value = formSchemaFromType(newType);
    if (newId && newType === DataFieldType.TEXT_FIELD) {
      dataFieldToModify.value = draftStore.findDataField(newId);
      formData.value = { name: dataFieldToModify.value?.name };
    }
  },
  { immediate: true, deep: true }, // Optional: to run the watcher immediately when the component mounts
);

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
  }

  draftSidebarStore.close();
};
</script>
