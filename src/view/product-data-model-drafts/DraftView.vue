<template>
  <div v-if="draft" class="flex flex-col gap-4">
    <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
      <div class="px-4 py-6 sm:px-6">
        <h3 class="text-base/7 font-semibold text-gray-900">
          Datenmodellentwurf {{ draft.name }}
        </h3>
      </div>
    </div>
    <AddSection :draft-id="draft.id" @section-created="fetchDraft" />
    <div class="grid gap-4">
      <Section
        class="overflow-hidden rounded-xl border border-gray-200"
        v-for="section of draft.sections"
        :key="section.id"
        :draft-id="draft.id"
        :section="section"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import apiClient from "../../lib/api-client";
import { ProductDataModelDraftDto } from "../../../../open-dpp-api-client";
import { useRoute } from "vue-router";
import AddSection from "../../components/product-data-model-drafts/AddSection.vue";
import Section from "../../components/product-data-model-drafts/Section.vue";

const route = useRoute();

const draft = ref<ProductDataModelDraftDto>();

const fetchDraft = async () => {
  draft.value = (
    await apiClient.productDataModelDrafts.getById(String(route.params.draftId))
  ).data;
};

onMounted(async () => {
  await fetchDraft();
});
</script>
