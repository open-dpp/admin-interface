<template>
  <AddNode v-if="!props.gridItem.content" :parent-id="props.gridItem.id" />
  <GridSection
    v-else-if="isGridContainerOrSubclass(props.gridItem.content)"
    :grid-section="props.gridItem.content"
    :parent-id="props.gridItem.id"
  />
  <DataFieldRef
    v-else-if="isDataFieldRef(props.gridItem.content)"
    :data-field-ref="props.gridItem.content"
  />
</template>

<script setup lang="ts">
import AddNode from "./AddNode.vue";
import GridSection from "./GridSection.vue";
import {
  GridItemDto,
  isDataFieldRef,
  isGridContainerOrSubclass,
} from "@open-dpp/api-client";
import DataFieldRef from "./DataFieldRef.vue";

const props = defineProps<{ gridItem: GridItemDto }>();
</script>
