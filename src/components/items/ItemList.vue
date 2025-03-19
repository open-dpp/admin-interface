<template>
  <div>
    <ListHeader
      entity-name="Artikel"
      @add="emits('add')"
      creation-label="Artikel hinzufügen"
    />
    <SimpleTable :headers="['ID']" :rows="rows" :row-actions="actions" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import Item from "../../types/Item";
import { useIndexStore } from "../../stores";
import { useRoute } from "vue-router";
import ListHeader from "../lists/ListHeader.vue";
import SimpleTable from "../lists/SimpleTable.vue";

const indexStore = useIndexStore();

const route = useRoute();

const props = defineProps<{
  items: Item[];
}>();

const emits = defineEmits<{
  (e: "add"): void;
}>();

const rows = computed(() => {
  return props.items.map((i) => ({ id: i.id }));
});

const actions = [
  {
    name: "QR-Code",
    actionLinkBuilder: (row: Record<string, string>) =>
      `/organizations/${indexStore.selectedOrganization}/models/${route.params.modelId}/items/${row.id}/qr-code`,
  },
];
</script>
