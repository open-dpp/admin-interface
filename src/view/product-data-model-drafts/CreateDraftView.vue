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
      <CreateDraftForm @submit="onSubmit" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import CreateDraftForm from "../../components/product-data-model-drafts/CreateDraftForm.vue";
import { useRoute, useRouter } from "vue-router";
import { useDraftStore } from "../../stores/draft";
import { useViewStore } from "../../stores/view";

const router = useRouter();
const route = useRoute();

const draftStore = useDraftStore();
const viewStore = useViewStore();

const onSubmit = async (draftName: string) => {
  await draftStore.createDraft({
    name: draftName,
  });
  await viewStore.createView({
    name: `Standard view ${draftName}`,
    dataModelId: draftStore.draft!.id,
  });

  await router.push(
    `/organizations/${route.params.organizationId}/data-model-drafts/${draftStore.draft?.id}`,
  );
};
</script>
