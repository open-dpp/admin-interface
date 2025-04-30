<template>
  <div v-if="draftStore.draft" class="flex flex-col gap-4">
    <div class="flex-1 flex flex-col gap-4 transition-all duration-300">
      <div
        class="flex px-4 py-6 sm:px-6 justify-between items-center bg-white shadow-sm sm:rounded-lg"
      >
        <div>
          <h3 class="text-base/7 font-semibold text-gray-900">
            Datenmodellentwurf {{ draftStore.draft.data.name }}
          </h3>
          <p class="mt-1 max-w-2xl text-sm/6 text-gray-500">
            Version {{ draftStore.draft.data.version }}
          </p>
        </div>
        <div class="">
          <PublishDraftButton @on-publish="onPublish" />
        </div>
      </div>
    </div>
    <AddNode
      :col-span="{ sm: 1 }"
      :col-start="{ sm: 1 }"
      :row-start="{ sm: 1 }"
    />
    <div v-if="draftStore.draft.view" class="grid grid-cols-1 gap-4">
      <GridSection
        v-for="node of draftStore.draft.view.nodes.filter(
          (n) => n.parentId === undefined && isSectionGrid(n),
        )"
        :key="node.id"
        :section-grid="node as SectionGridDto"
      />
    </div>
    <DraftSidebar />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useDraftStore } from "../../stores/draft";
import {
  isSectionGrid,
  SectionGridDto,
  VisibilityLevel,
} from "@open-dpp/api-client";
import PublishDraftButton from "../../components/product-data-model-drafts/PublishDraftButton.vue";
import { useNotificationStore } from "../../stores/notification";
import { useIndexStore } from "../../stores";
import AddNode from "../../components/product-data-model-drafts/AddNode.vue";
import DraftSidebar from "../../components/product-data-model-drafts/DraftSidebar.vue";
import GridSection from "../../components/product-data-model-drafts/GridSection.vue";

const route = useRoute();

const draftStore = useDraftStore();
const notificationStore = useNotificationStore();
const indexStore = useIndexStore();

const fetchData = async () => {
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
  await fetchData();
});
</script>
