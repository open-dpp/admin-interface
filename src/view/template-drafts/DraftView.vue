<template>
  <div v-if="draftStore.draft" class="flex flex-col gap-4 pt-5">
    <div class="flex-1 flex flex-col gap-4 transition-all duration-300">
      <div
        class="flex px-4 py-6 sm:px-6 justify-between items-center bg-white shadow-sm sm:rounded-lg"
      >
        <div>
          <h3 class="text-base/7 font-semibold text-gray-900">
            Passvorlagen Entwurf {{ draftStore.draft.name }}
          </h3>
          <p class="mt-1 max-w-2xl text-sm/6 text-gray-500">
            Version {{ draftStore.draft.version }}
          </p>
        </div>
        <div class="">
          <PublishDraftButton @on-publish="onPublish" />
        </div>
      </div>
    </div>
    <AddNode
      :layout="{
        colSpan: { sm: 1 },
        rowSpan: { sm: 1 },
        colStart: { sm: 1 },
        rowStart: { sm: 1 },
      }"
    />
    <div v-if="draftStore.draft" class="grid grid-cols-1 gap-4">
      <div
        v-for="section of rootSections"
        :key="section.id"
        class="grid grid-cols-1 overflow-hidden bg-white shadow sm:rounded-lg w-full"
      >
        <BaseSectionHeader :section="section">
          <template #action>
            <BaseButton
              variant="primary"
              @click="onEditSectionClicked(section)"
              :data-cy="`edit-section-${section.id}`"
            >
              Editieren
            </BaseButton>
          </template>
        </BaseSectionHeader>
        <div class="p-4">
          <SectionDraft :section="section" />
        </div>
      </div>
    </div>
    <DraftSidebar />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useDraftStore } from "../../stores/draft";
import { SectionDto, VisibilityLevel } from "@open-dpp/api-client";
import PublishDraftButton from "../../components/template-drafts/PublishDraftButton.vue";
import { useNotificationStore } from "../../stores/notification";
import { useIndexStore } from "../../stores";
import AddNode from "../../components/template-drafts/AddNode.vue";
import DraftSidebar from "../../components/template-drafts/DraftSidebar.vue";
import SectionDraft from "../../components/template-drafts/SectionDraft.vue";
import BaseSectionHeader from "../../components/BaseSectionHeader.vue";
import BaseButton from "../../components/BaseButton.vue";
import {
  SidebarContentType,
  useDraftSidebarStore,
} from "../../stores/draftSidebar";

const route = useRoute();

const draftStore = useDraftStore();
const notificationStore = useNotificationStore();
const indexStore = useIndexStore();

const draftSidebarStore = useDraftSidebarStore();

const onEditSectionClicked = (section: SectionDto) => {
  draftSidebarStore.open(SidebarContentType.SECTION_FORM, {
    type: section.type,
    layout: section.layout,
    id: section.id,
  });
};

const rootSections = computed<SectionDto[]>(
  () =>
    draftStore.draft?.sections.filter((n) => n.parentId === undefined) ?? [],
);

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
