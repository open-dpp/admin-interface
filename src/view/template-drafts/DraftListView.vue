<template>
  <section>
    <div v-if="!fetchInFlight" class="flex flex-col gap-3 p-3">
      <DraftsList v-if="drafts.length > 0" :drafts="drafts" />
      <EmptyState
        v-else
        button-label="Neuen Produktpass designen"
        :button-link="`/organizations/${indexStore.selectedOrganization}/data-model-drafts/create`"
      />
    </div>
  </section>
</template>

<script lang="ts" setup>
import DraftsList from "../../components/template-drafts/DraftsList.vue";
import { onMounted, ref } from "vue";
import apiClient from "../../lib/api-client";
import EmptyState from "../../components/models/EmptyState.vue";
import { useIndexStore } from "../../stores";
import { TemplateDraftGetAllDto } from "@open-dpp/api-client";

const indexStore = useIndexStore();
const fetchInFlight = ref(true);

const drafts = ref<TemplateDraftGetAllDto[]>([]);

onMounted(async () => {
  fetchInFlight.value = true;
  drafts.value = (await apiClient.dpp.productDataModelDrafts.getAll()).data;
  fetchInFlight.value = false;
});
</script>
