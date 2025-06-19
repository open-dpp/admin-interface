<template>
  <ListHeader
    title="Verbindungen"
    description="Alle Ihre Verbindungen"
    creation-label="Verbindung erstellen"
    :creation-link="`/organizations/${indexStore.selectedOrganization}/integration/${PRO_ALPHA_INTEGRATION_ID}/connections/create`"
  />
  <SimpleTable :headers="['ID', 'Name']" :rows="rows" :row-actions="actions" />
</template>

<script setup lang="ts">
import ListHeader from "../../components/lists/ListHeader.vue";
import SimpleTable from "../../components/lists/SimpleTable.vue";
import { computed, onMounted } from "vue";
import { useAasIntegrationStore } from "../../stores/aas.integration";
import { useIndexStore } from "../../stores";
import { PRO_ALPHA_INTEGRATION_ID } from "../../const";

const aasIntegrationStore = useAasIntegrationStore();
const indexStore = useIndexStore();
const rows = computed(() => {
  return aasIntegrationStore.aasConnections.map((c) => ({
    id: c.id,
    name: c.name,
  }));
});

const actions = [
  {
    name: "Editieren",
    actionLinkBuilder: (row: Record<string, string>) =>
      `/organizations/${indexStore.selectedOrganization}/integration/pro-alpha/connections/${row.id}`,
  },
];

onMounted(async () => {
  await aasIntegrationStore.fetchConnections();
});
</script>
