<template>
  <div class="flex flex-col gap-3 p-3">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold text-gray-900">Integrationen</h1>
        <p class="mt-2 text-sm text-gray-700">Alle Ihre Integrationen</p>
      </div>
    </div>
    <SimpleTable
      :headers="['Name', 'Status']"
      :rows="rows"
      :row-actions="actions"
    />
  </div>
</template>

<script setup lang="ts">
import SimpleTable from "../../components/lists/SimpleTable.vue";
import { useIndexStore } from "../../stores";
import { PRO_ALPHA_INTEGRATION_ID } from "../../const";

const rows = [
  {
    name: "ProAlpha Integration",
    status: "Aktiv",
    id: PRO_ALPHA_INTEGRATION_ID,
  },
];
const indexStore = useIndexStore();

const actions = [
  {
    name: "Editieren",
    actionLinkBuilder: (row: Record<string, string>) =>
      `/organizations/${indexStore.selectedOrganization}/integrations/${row.id}`,
  },
];
</script>
