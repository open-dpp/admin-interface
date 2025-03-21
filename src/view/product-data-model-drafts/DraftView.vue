<template>
  <div v-if="draftStore.draft" class="flex flex-col gap-4">
    <div
      class="flex px-4 py-6 sm:px-6 justify-between items-center bg-white shadow-sm sm:rounded-lg"
    >
      <div>
        <h3 class="text-base/7 font-semibold text-gray-900">
          Datenmodellentwurf {{ draftStore.draft.name }}
        </h3>
        <p class="mt-1 max-w-2xl text-sm/6 text-gray-500">
          Version {{ draftStore.draft.version }}
        </p>
      </div>
      <div class="">
        <PublishDraftButton @on-publish="onPublish" />
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
import { VisibilityLevel } from "@open-dpp/api-client";
import PublishDraftButton from "../../components/product-data-model-drafts/PublishDraftButton.vue";
import { useNotificationStore } from "../../stores/notification";
import { useIndexStore } from "../../stores";

const route = useRoute();

const draftStore = useDraftStore();
const notificationStore = useNotificationStore();
const indexStore = useIndexStore();

const fetchDraft = async () => {
  await draftStore.fetchDraft(String(route.params.draftId));
};
const onPublish = async (visibility: VisibilityLevel) => {
  await draftStore.publish({ visibility });
  notificationStore.addSuccessNotification(
    "Ihr Entwurf wurde erfolgreich veröffentlicht. Sie können nun darauf basierend Modelle anlegen.",
    {
      label: "Modell anlegen",
      to: `/organizations/${indexStore.selectedOrganization}/models/create`,
    },
  );
};

onMounted(async () => {
  await fetchDraft();
});
</script>
