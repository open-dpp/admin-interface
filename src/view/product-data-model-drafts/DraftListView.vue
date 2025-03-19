<template>
  <section>
    <div class="flex flex-col gap-3 p-3">
      <DraftsList v-if="drafts.length > 0" :drafts="drafts" />
      <EmptyState
        v-else
        button-label="Neues Datenmodell entwerfen"
        :button-link="`/organizations/${indexStore.selectedOrganization}/data-model-drafts/create`"
      />
    </div>
  </section>
</template>

<script lang="ts" setup>
import DraftsList from "../../components/product-data-model-drafts/DraftsList.vue";
import { onMounted, ref } from "vue";
import { ProductDataModelDraftGetAllDto } from "../../../../open-dpp-api-client/src";
import apiClient from "../../lib/api-client";
import EmptyState from "../../components/models/EmptyState.vue";
import { useIndexStore } from "../../stores";

const indexStore = useIndexStore();

const drafts = ref<ProductDataModelDraftGetAllDto[]>([]);

onMounted(async () => {
  drafts.value = (await apiClient.productDataModelDrafts.getAll()).data;
});
</script>
