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
      <div class="flex gap-1">
        <BaseButton variant="primary" data-cy="submit" type="submit">
          {{ sectionToModify ? "Ändern" : "Hinzufügen" }}
        </BaseButton>
        <BaseButton
          v-if="sectionToModify"
          data-cy="delete"
          type="button"
          variant="error"
          @click="onDelete"
        >
          Abschnitt löschen
        </BaseButton>
      </div>
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
import BaseButton from "../BaseButton.vue";
import { useModelDialogStore } from "../../stores/modal.dialog";

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
const modelDialogStore = useModelDialogStore();

const formSchemaFromType = (
  type: SectionType,
  showColumnSelect: boolean,
  existingGranularityLevel: GranularityLevel | undefined,
) => {
  const colOptions = Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [i + 1, (i + 1).toString()]),
  );

  const granularityOptions = {
    [GranularityLevel.MODEL]: "Produktmodellebene",
    [GranularityLevel.ITEM]: "Artikelebene",
  };

  const dataSectionFormkitSchema = [];
  dataSectionFormkitSchema.push({
    $formkit: "text",
    name: "name",
    label: "Name des Abschnitts",
    "data-cy": "name",
  });

  if (showColumnSelect) {
    dataSectionFormkitSchema.push({
      $formkit: "select",
      name: "cols",
      label: "Spaltenanzahl",
      options: colOptions,
      "data-cy": "select-col-number",
    });
  }

  if (!existingGranularityLevel && type === SectionType.REPEATABLE) {
    dataSectionFormkitSchema.push({
      $formkit: "select",
      name: "granularityLevel",
      label: "Granularitätsebene",
      options: granularityOptions,
      "data-cy": "select-granularity-level",
    });
  }
  return dataSectionFormkitSchema;
};

watch(
  [() => props.type, () => props.id], // The store property to watch
  ([newType, newId]) => {
    const dataSection = newId ? draftStore.findSectionById(newId) : undefined;
    formSchema.value = formSchemaFromType(
      newType,
      dataSection === undefined,
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
  { immediate: true }, // Optional: to run the watcher immediately when the component mounts
);

const numberFromString = z.preprocess(
  (val) => (typeof val === "string" ? Number(val) : val),
  z.number(),
);

const onDelete = async () => {
  modelDialogStore.open(
    {
      title: "Abschnitt löschen",
      description: "Sind Sie sicher, dass Sie diesen Abschnitt löschen wollen?",
      type: "warning",
    },
    async () => {
      if (sectionToModify.value) {
        await draftStore.deleteSection(sectionToModify.value.id);
        draftSidebarStore.close();
      }
    },
  );
};

const onSubmit = async () => {
  const data = z
    .object({
      name: z.string(),
      cols: numberFromString,
      granularityLevel: z.enum(GranularityLevel).optional(),
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
