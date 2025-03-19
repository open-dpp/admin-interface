<template>
  <div class="">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold text-gray-900">
          Datenmodellentwurf
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          Entwerfen Sie ein neues Datenmodell.
        </p>
      </div>
    </div>
    <div class="mt-8 flow-root">
      <CreateDraftView @submit="onSubmit" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import CreateDraftView from "../../components/product-data-model-drafts/CreateDraftForm.vue";
import apiClient from "../../lib/api-client";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const onSubmit = async (draftName: string) => {
  await apiClient.productDataModelDrafts.create({
    name: draftName,
  });

  await router.push(
    `/organizations/${route.params.organizationId}/data-model-drafts`,
  );
};
</script>
