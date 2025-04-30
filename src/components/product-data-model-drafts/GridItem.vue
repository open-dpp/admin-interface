<template>
  <div v-if="gridItem">
    <GridSection v-if="isSectionGrid(gridItem)" :section-grid="gridItem" />
    <DataFieldRef
      v-else-if="isDataFieldRef(gridItem)"
      :data-field-ref="gridItem"
    />
  </div>
</template>

<script setup lang="ts">
import GridSection from "./GridSection.vue";
import { isDataFieldRef, isSectionGrid } from "@open-dpp/api-client";
import DataFieldRef from "./DataFieldRef.vue";
import { useDraftStore } from "../../stores/draft";
import { computed } from "vue";

const props = defineProps<{ gridItemId: string }>();
const draftStore = useDraftStore();
const gridItem = computed(() => {
  return draftStore.findNodeById(props.gridItemId);
});
</script>
