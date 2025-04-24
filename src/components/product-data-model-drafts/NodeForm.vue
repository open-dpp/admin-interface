<template>
  <!--  <div class="flex flex-col h-full">-->
  <!--    <div class="flex flex-1 h-0">hello</div>-->
  <!--    <div class="flex flex-shrink-0 justify-end px-4 py-4">Speichern</div>-->
  <!--  </div>-->
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
  DataFieldRefCreateDto,
  DataFieldType,
  isSectionGrid,
  NodeType,
  SectionGridContainerCreateDto,
  SectionType,
} from "@open-dpp/api-client";
import { useDraftStore } from "../../stores/draft";
import { z } from "zod";
import { useViewStore } from "../../stores/view";
import { useDraftSidebarStore } from "../../stores/draftSidebar";

const props = defineProps<{
  type: string;
  parentId?: string;
}>();

const formData = ref<Record<string, unknown>>({});
const formSchema = ref();
const draftStore = useDraftStore();
const viewStore = useViewStore();
const draftSidebarStore = useDraftSidebarStore();

const formSchemaFromType = (type: string) => {
  const colOptions = {
    1: "1",
    2: "2",
    3: "3",
  };
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

const numberFromString = z.preprocess(
  (val) => (typeof val === "string" ? Number(val) : val),
  z.number(),
);

const onSubmit = async () => {
  if (
    props.type === SectionType.GROUP ||
    props.type === SectionType.REPEATABLE
  ) {
    const data = z
      .object({ name: z.string(), cols: numberFromString })
      .parse(formData.value);
    await draftStore.addSection({ type: props.type, name: data.name });
    const sectionGrid: SectionGridContainerCreateDto = {
      type: NodeType.SECTION_GRID,
      sectionId:
        draftStore.draft!.sections[draftStore.draft!.sections.length - 1].id,
      cols: { sm: data.cols },
      initNumberOfChildren: data.cols,
    };
    await viewStore.addNode({ node: sectionGrid, parentId: props.parentId });
    draftSidebarStore.close();
  } else if (props.type === DataFieldType.TEXT_FIELD && props.parentId) {
    const data = z.object({ name: z.string() }).parse(formData.value);
    const found = viewStore.findNodeWithParentById(props.parentId);
    if (found?.parent && isSectionGrid(found.parent)) {
      const section = draftStore.findSectionById(found.parent.sectionId);
      if (section) {
        await draftStore.addDataField(section.id, {
          type: props.type,
          name: data.name,
        });

        const updatedSection = draftStore.findSectionById(section.id);

        const dataFieldRef: DataFieldRefCreateDto = {
          type: NodeType.DATA_FIELD_REF,
          fieldId:
            updatedSection!.dataFields[updatedSection!.dataFields.length - 1]
              .id,
        };
        await viewStore.addNode({
          node: dataFieldRef,
          parentId: props.parentId,
        });
      }
    }
    draftSidebarStore.close();
  }
};
</script>
