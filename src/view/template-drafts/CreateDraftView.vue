<template>
  <div class="flex flex-col gap-3 p-3">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold text-gray-900">
          Produktpass Design
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          Designen Sie einen neuen Produktpass.
        </p>
      </div>
    </div>
    <div>
      <CreateDraftForm @submit="onSubmit" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import CreateDraftForm from "../../components/template-drafts/CreateDraftForm.vue";
import { useRoute, useRouter } from "vue-router";
import { useDraftStore } from "../../stores/draft";

const router = useRouter();
const route = useRoute();

const draftStore = useDraftStore();

const onSubmit = async (draftName: string) => {
  await draftStore.createDraft({
    name: draftName,
  });

  await router.push(
    `/organizations/${route.params.organizationId}/data-model-drafts/${draftStore.draft?.id}`,
  );
};
</script>
