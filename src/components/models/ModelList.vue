<template>
  <div class="">
    <ListHeader
      entity-name="Modelle"
      :creation-link="`/organizations/${indexStore.selectedOrganization}/models/create`"
      creation-label="Modell hinzufügen"
    />
    <SimpleTable
      :headers="['ID', 'Name']"
      :rows="rows"
      :row-actions="actions"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useModelsStore } from "../../stores/models";
import { useIndexStore } from "../../stores";
import SimpleTable from "../lists/SimpleTable.vue";
import ListHeader from "../lists/ListHeader.vue";

const indexStore = useIndexStore();
const modelsStore = useModelsStore();

const rows = computed(() => {
  return modelsStore.models.map((m) => ({ id: m.id, name: m.name }));
});

const actions = [
  {
    name: "Artikel",
    actionLinkBuilder: (row: Record<string, string>) =>
      `/organizations/${indexStore.selectedOrganization}/models/${row.id}/items`,
  },
  {
    name: "Editieren",
    actionLinkBuilder: (row: Record<string, string>) =>
      `/organizations/${indexStore.selectedOrganization}/models/${row.id}`,
  },
  {
    name: "QR-Code",
    actionLinkBuilder: (row: Record<string, string>) =>
      `/organizations/${indexStore.selectedOrganization}/models/${row.id}/qr-code`,
  },
];

onMounted(async () => {
  await modelsStore.getModels();
});
</script>
