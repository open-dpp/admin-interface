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
      <FormKit data-cy="submit" label="Hinzufügen" type="submit" />
    </FormKit>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import {
  DataFieldType,
  isSectionGrid,
  ResponsiveConfigDto,
  SectionType,
} from "@open-dpp/api-client";
import { useDraftStore } from "../../stores/draft";
import { z } from "zod";
import { useDraftSidebarStore } from "../../stores/draftSidebar";

const props = defineProps<{
  type: string;
  parentId?: string;
  colSpan: ResponsiveConfigDto;
  colStart: ResponsiveConfigDto;
  rowStart: ResponsiveConfigDto;
}>();

const formData = ref<Record<string, unknown>>({});
const formSchema = ref();
const draftStore = useDraftStore();
const draftSidebarStore = useDraftSidebarStore();

const formSchemaFromType = (type: string) => {
  const colOptions = Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [i + 1, (i + 1).toString()]),
  );

  switch (type) {
    case SectionType.GROUP:
    case SectionType.REPEATABLE:
      return [
        {
          $formkit: "text",
          name: "name",
          label: "Name des Abschnitts",
          "data-cy": "name",
        },
        {
          $formkit: "select",
          name: "cols",
          label: "Spaltenanzahl",
          options: colOptions,
          "data-cy": "select-col-number",
        },
      ];
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
  () => props.type, // The store property to watch
  (newValue) => {
    formSchema.value = formSchemaFromType(newValue);
  },
  { immediate: true, deep: true }, // Optional: to run the watcher immediately when the component mounts
);

console.log(props);
const numberFromString = z.preprocess(
  (val) => (typeof val === "string" ? Number(val) : val),
  z.number(),
);

const onSubmit = async () => {
  const foundParentNode = props.parentId
    ? draftStore.findNodeById(props.parentId)
    : undefined;
  if (
    props.type === SectionType.GROUP ||
    props.type === SectionType.REPEATABLE
  ) {
    const data = z
      .object({ name: z.string(), cols: numberFromString })
      .parse(formData.value);
    await draftStore.addSection({
      type: props.type,
      name: data.name,
      parentSectionId:
        foundParentNode && isSectionGrid(foundParentNode)
          ? foundParentNode.sectionId
          : undefined,
      view: {
        cols: { sm: data.cols },
        colStart: props.colStart,
        colSpan: props.colSpan,
        rowStart: props.rowStart,
      },
    });
    draftSidebarStore.close();
  } else if (props.type === DataFieldType.TEXT_FIELD && props.parentId) {
    const data = z.object({ name: z.string() }).parse(formData.value);
    if (foundParentNode && isSectionGrid(foundParentNode)) {
      await draftStore.addDataField(foundParentNode.sectionId, {
        type: props.type,
        name: data.name,
        view: {
          colStart: props.colStart,
          colSpan: props.colSpan,
          rowStart: props.rowStart,
        },
      });
    }
  }
  draftSidebarStore.close();
};
</script>
