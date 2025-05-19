<template>
  <button
    @click="open"
    type="button"
    class="flex flex-row w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 h-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
  >
    <PlusCircleIcon class="-ml-0.5 size-5" aria-hidden="true" />Hinzufügen
  </button>
</template>

<script lang="ts" setup>
import {
  SidebarContentType,
  useDraftSidebarStore,
} from "../../stores/draftSidebar";
import { PlusCircleIcon } from "@heroicons/vue/24/outline";
import { LayoutDto } from "@open-dpp/api-client";

const props = defineProps<{
  parentId?: string;
  layout: LayoutDto;
}>();

const open = () => {
  draftSidebarStore.open(SidebarContentType.ITEM_SELECTION, {
    parentId: props.parentId,
    layout: props.layout,
  });
};

const draftSidebarStore = useDraftSidebarStore();
</script>
