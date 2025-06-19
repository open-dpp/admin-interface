<template>
  <section>
    <div v-if="!fetchInFlight" class="flex flex-col gap-3 p-3">
      <ConnectionList v-if="aasIntegrationStore.aasConnections.length > 0" />
      <EmptyState
        v-else
        :button-link="`/organizations/${indexStore.selectedOrganization}/integration/${PRO_ALPHA_INTEGRATION_ID}/connections/create`"
        button-label="Neue Verbindung hinzufügen"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAasIntegrationStore } from "../../stores/aas.integration";
import EmptyState from "../../components/models/EmptyState.vue";
import ConnectionList from "../../components/integrations/ConnectionList.vue";
import { useIndexStore } from "../../stores";
import { PRO_ALPHA_INTEGRATION_ID } from "../../const";

const fetchInFlight = ref(true);

const aasIntegrationStore = useAasIntegrationStore();
const indexStore = useIndexStore();

onMounted(async () => {
  fetchInFlight.value = true;
  await aasIntegrationStore.fetchConnections();
  fetchInFlight.value = false;
});
</script>
