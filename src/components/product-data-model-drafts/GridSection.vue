<template>
  <div class="flex flex-col gap-2 rounded-lg bg-white shadow">
    <div v-if="section" class="flex flex-row gap-x-2 items-center">
      <div
        :class="[
          section.type === SectionType.REPEATABLE
            ? 'bg-pink-500'
            : 'bg-indigo-500',
          'flex size-13 items-center justify-center',
        ]"
      >
        <component
          :is="
            section.type === SectionType.REPEATABLE
              ? ArrowPathIcon
              : TableCellsIcon
          "
          class="size-6 text-white"
          aria-hidden="true"
        />
      </div>
      <div class="text-sm/6 font-medium text-gray-900">
        {{ section.name }}
      </div>
    </div>
    <div
      :data-cy="gridSection.id"
      :class="[
        'grid gap-1 p-0.5 items-end',
        viewStore.generateClassesForNode(gridSection.id),
      ]"
    >
      <div
        v-for="gridItem of props.gridSection.children"
        :key="gridItem.id"
        :data-cy="gridItem.id"
        :class="[viewStore.generateClassesForNode(gridItem.id)]"
      >
        <GridItem :grid-item="gridItem" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import GridItem from "./GridItem.vue";
import {
  GridContainerDto,
  isSectionGrid,
  SectionType,
} from "@open-dpp/api-client";
import { useViewStore } from "../../stores/view";
import { computed } from "vue";
import { useDraftStore } from "../../stores/draft";
import { ArrowPathIcon, TableCellsIcon } from "@heroicons/vue/24/outline";

const props = defineProps<{
  gridSection: GridContainerDto;
  parentId?: string;
}>();
const viewStore = useViewStore();
const draftStore = useDraftStore();

const section = computed(() => {
  return isSectionGrid(props.gridSection)
    ? draftStore.findSectionById(props.gridSection.sectionId)
    : undefined;
});
</script>
