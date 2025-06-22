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

<script lang="ts" setup>
import { ref, watch } from "vue";
import {
  GranularityLevel,
  LayoutDto,
  SectionDto,
  SectionType,
} from "@open-dpp/api-client";
import { useDraftStore } from "../../stores/draft";
import { z } from "zod/v4";
import { useDraftSidebarStore } from "../../stores/draftSidebar";

const props = defineProps<{
  type: SectionType;
  parentId?: string;
  parentGranularityLevel?: GranularityLevel;
  layout: LayoutDto;
  id?: string;
}>();

const formData = ref<Record<string, unknown>>({});
const formSchema = ref();
const sectionToModify = ref<SectionDto | undefined>();
const draftStore = useDraftStore();
const draftSidebarStore = useDraftSidebarStore();

const formSchemaFromType = (
  type: string,
  existingGranularityLevel: GranularityLevel | undefined,
) => {
  const colOptions = Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [i + 1, (i + 1).toString()]),
  );

  const granularityOptions = {
    [GranularityLevel.MODEL]: "Produktmodellebene",
    [GranularityLevel.ITEM]: "Artikelebene",
  };

  const commonFields = [
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

  switch (type) {
    case SectionType.GROUP:
      return commonFields;
    case SectionType.REPEATABLE:
      return [
        ...commonFields,
        !existingGranularityLevel
          ? {
              $formkit: "select",
              name: "granularityLevel",
              label: "Granularitätsebene",
              options: granularityOptions,
              "data-cy": "select-granularity-level",
            }
          : undefined,
      ].filter((d) => d !== undefined);
    default:
      throw new Error(`Unsupported node type: ${type}`);
  }
};

watch(
  [() => props.type, () => props.id], // The store property to watch
  ([newType, newId]) => {
    const dataSection = newId ? draftStore.findSectionById(newId) : undefined;
    formSchema.value = formSchemaFromType(
      newType,
      dataSection?.granularityLevel ?? props.parentGranularityLevel,
    );
    if (dataSection) {
      sectionToModify.value = dataSection;
      formData.value = {
        name: sectionToModify.value.name,
        cols: sectionToModify.value.layout.cols.sm,
        granularityLevel: sectionToModify.value.granularityLevel,
      };
    }
  },
  { immediate: true, deep: true }, // Optional: to run the watcher immediately when the component mounts
);

const numberFromString = z.preprocess(
  (val) => (typeof val === "string" ? Number(val) : val),
  z.number(),
);

const onSubmit = async () => {
  const data = z
    .object({
      name: z.string(),
      cols: numberFromString,
      granularityLevel: z.nativeEnum(GranularityLevel).optional(),
    })
    .parse({
      granularityLevel: props.parentGranularityLevel,
      ...formData.value,
    });
  if (sectionToModify.value) {
    await draftStore.modifySection(sectionToModify.value.id, {
      name: data.name,
      layout: { ...sectionToModify.value.layout, cols: { sm: data.cols } },
    });
  } else {
    await draftStore.addSection({
      type: props.type,
      name: data.name,
      parentSectionId: props.parentId,
      layout: { cols: { sm: data.cols }, ...props.layout },
      granularityLevel: data.granularityLevel,
    });
  }
  draftSidebarStore.close();
};
</script>
