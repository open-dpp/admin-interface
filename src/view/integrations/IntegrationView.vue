<template>
  <div class="flex flex-col gap-3 p-3">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold text-gray-900">Integrationen</h1>
        <p class="mt-2 text-sm text-gray-700">Alle Ihre Integrationen</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
          class="block rounded-md bg-indigo-600 px-3 py-1.5 text-center text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          @click="createApiKey"
        >
          API Key erstellen
        </button>
      </div>
    </div>
    <SimpleTable
      :headers="['Name', 'Status']"
      :row-actions="actions"
      :rows="rows"
    />
  </div>
</template>

<script lang="ts" setup>
import SimpleTable from "../../components/lists/SimpleTable.vue";
import { useIndexStore } from "../../stores";
import { PRO_ALPHA_INTEGRATION_ID } from "../../const";
import keycloakIns from "../../lib/keycloak";
import axiosIns from "../../lib/axios";
import { useNotificationStore } from "../../stores/notification";

const rows = [
  {
    name: "ProAlpha Integration",
    status: "Aktiv",
    id: PRO_ALPHA_INTEGRATION_ID,
  },
];
const indexStore = useIndexStore();
const notificationStore = useNotificationStore();

const actions = [
  {
    name: "Editieren",
    actionLinkBuilder: (row: Record<string, string>) =>
      `/organizations/${indexStore.selectedOrganization}/integrations/${row.id}/connections`,
  },
];

const createApiKey = async () => {
  const response = await axiosIns.post(
    keycloakIns.authServerUrl + "/realms/open-dpp/api-key/create",
  );
  if (response.status === 200) {
    notificationStore.addSuccessNotification(
      "API Key wurde erfolgreich erstellt: " + response.data,
    );
  }
};
</script>
