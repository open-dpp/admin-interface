<template>
  <div v-if="draftStore.draft" class="flex flex-col gap-4">
    <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
      <div class="px-4 py-6 sm:px-6">
        <h3 class="text-base/7 font-semibold text-gray-900">
          Datenmodellentwurf {{ draftStore.draft.name }}
        </h3>
      </div>
    </div>
    <AddSection />
    <div class="grid gap-4">
      <Section
        class="overflow-hidden rounded-xl border border-gray-200"
        v-for="section of draftStore.draft.sections"
        :key="section.id"
        :section="section"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import AddSection from "../../components/product-data-model-drafts/AddSection.vue";
import Section from "../../components/product-data-model-drafts/Section.vue";
import { useDraftStore } from "../../stores/draft";

const route = useRoute();

const draftStore = useDraftStore();

const fetchDraft = async () => {
  await draftStore.fetchDraft(String(route.params.draftId));
};

onMounted(async () => {
  await fetchDraft();
});
</script>
