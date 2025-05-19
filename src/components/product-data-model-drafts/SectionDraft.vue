<template>
  <div
    v-if="props.section"
    :data-cy="props.section.id"
    :class="[
      'grid gap-1 p-0.5',
      generateClassesForLayout(props.section.layout),
    ]"
  >
    <DataFieldDraft
      v-for="dataField of props.section.dataFields"
      :key="dataField.id"
      :data-cy="dataField.id"
      :data-field="dataField"
    />
    <SectionDraft
      v-for="section of subSections"
      :key="section.id"
      :section="section"
    />
    <AddNode
      v-for="(emptySpace, index) in draftStore.findEmptySpacesInSectionLayout(
        props.section,
      )"
      :class="generateClassesForLayout(emptySpace)"
      :key="index"
      :data-cy="`${props.section.id}-${index}`"
      :parent-id="props.section.id"
      :layout="emptySpace"
    />
  </div>
</template>

<script lang="ts" setup>
import { useDraftStore } from "../../stores/draft";
import AddNode from "./AddNode.vue";
import { SectionDto } from "@open-dpp/api-client";
import DataFieldDraft from "./DataFieldDraft.vue";
import { generateClassesForLayout } from "../../lib/layout";
import { computed } from "vue";

const props = defineProps<{
  section: SectionDto;
}>();

const draftStore = useDraftStore();

const subSections = computed<SectionDto[]>(() =>
  props.section.subSections
    .map((sid) => draftStore.findSectionById(sid))
    .filter((s) => s !== undefined),
);
</script>
