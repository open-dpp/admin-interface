<template>
  <div class="grid grid-cols-1">
    <div
      v-if="props.sectionGrid"
      :data-cy="props.sectionGrid.id"
      :class="[
        'grid gap-1 p-0.5',
        draftStore.generateClassesForNode(props.sectionGrid.id),
      ]"
    >
      <GridItem
        v-for="gridItemId of props.sectionGrid.children"
        :key="gridItemId"
        :data-cy="gridItemId"
        :grid-item-id="gridItemId"
        :class="[draftStore.generateClassesForNode(gridItemId)]"
      />
      <AddNode
        v-for="(emptySpace, index) in draftStore.findEmptySpacesInSectionGrid(
          props.sectionGrid,
        )"
        :class="[
          ...generateClasses(emptySpace.colStart, 'col-start'),
          ...generateClasses(emptySpace.colSpan, 'col-span'),
          ...generateClasses(emptySpace.rowStart, 'row-start'),
        ]"
        :row-start="emptySpace.rowStart"
        :col-span="emptySpace.colSpan"
        :col-start="emptySpace.colStart"
        :key="index"
        :data-cy="`${props.sectionGrid.id}-${index}`"
        :parent-id="props.sectionGrid.id"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { generateClasses, useDraftStore } from "../../stores/draft";
import AddNode from "./AddNode.vue";
import { SectionGridDto } from "@open-dpp/api-client";
import GridItem from "./GridItem.vue";

const props = defineProps<{
  sectionGrid: SectionGridDto;
}>();

const draftStore = useDraftStore();
</script>
