<template>
  <div v-if="draftStore.draft" class="flex flex-col gap-4 pt-5">
    <div class="flex-1 flex flex-col gap-4 transition-all duration-300">
      <div
        class="flex px-4 py-6 sm:px-6 justify-between items-center bg-white shadow-sm sm:rounded-lg"
      >
        <div>
          <h3 class="text-base/7 font-semibold text-gray-900">
            {{ t("draft.passportDraft") + " " + draftStore.draft.name }}
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
    <div v-if="draftStore.draft" class="grid grid-cols-1 gap-4">
      <div class="flex items-center">
        <div class="flex" v-if="!currentSections.isRootLevel">
          <BaseButton
            v-if="currentSections.parentSection"
            @click="navigateBackToParent"
            >Zur Startseite</BaseButton
          >
          <BaseButton
            v-if="currentSections.parentSection?.parentId"
            @click="navigateBackToParent"
            >Zurück zu {{ currentSections.parentSection.name }}</BaseButton
          >
        </div>
        <AddSection
          :parent-granularity-level="
            currentSections.parentSection?.granularityLevel
          "
          :parent-id="currentSections.parentSection?.id"
        />
      </div>
      <div
        v-for="section of currentSections.subSections"
        :key="section.id"
        class="grid grid-cols-1 overflow-hidden bg-white shadow sm:rounded-lg w-full"
      >
        <BaseSectionHeader :section="section">
          <template #actions>
            <div class="flex" :data-cy="`actions-section-${section.id}`">
              <BaseButton
                variant="primary"
                @click="onEditSectionClicked(section)"
              >
                {{ t("draft.edit") }}
              </BaseButton>
              <BaseButton
                variant="primary"
                @click="onAddDataFieldClicked(section)"
              >
                {{ t("draft.addDataField") }}
              </BaseButton>
              <BaseButton
                variant="primary"
                @click="onAddSubSectionClicked(section)"
              >
                {{ t("draft.addSection") }}
              </BaseButton>
            </div>
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
import { useRoute, useRouter } from "vue-router";
import { useDraftStore } from "../../stores/draft";
import { SectionDto, VisibilityLevel } from "@open-dpp/api-client";
import PublishDraftButton from "../../components/template-drafts/PublishDraftButton.vue";
import { useNotificationStore } from "../../stores/notification";
import { useIndexStore } from "../../stores";
import DraftSidebar from "../../components/template-drafts/DraftSidebar.vue";
import BaseSectionHeader from "../../components/BaseSectionHeader.vue";
import BaseButton from "../../components/BaseButton.vue";
import {
  SidebarContentType,
  useDraftSidebarStore,
} from "../../stores/draftSidebar";
import AddSection from "../../components/template-drafts/AddSection.vue";
import SectionDraft from "../../components/template-drafts/SectionDraft.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const route = useRoute();
const router = useRouter();

const draftStore = useDraftStore();
const notificationStore = useNotificationStore();
const indexStore = useIndexStore();
const draftSidebarStore = useDraftSidebarStore();

const currentSections = computed(() => {
  const foundSection = route.query.sectionId
    ? draftStore.findSectionById(String(route.query.sectionId))
    : undefined;
  const currentSubSections =
    draftStore.draft?.sections.filter((s) => s.parentId === foundSection?.id) ??
    [];
  return {
    isRootLevel: !foundSection,
    parentSection: foundSection,
    subSections: currentSubSections,
  };
});

const onEditSectionClicked = (section: SectionDto) => {
  draftSidebarStore.open(SidebarContentType.SECTION_FORM, {
    type: section.type,
    id: section.id,
  });
};

const onAddDataFieldClicked = (section: SectionDto) => {
  draftSidebarStore.open(SidebarContentType.DATA_FIELD_SELECTION, {
    parentId: section.id,
    parentGranularityLevel: section.granularityLevel,
  });
};

const navigateBackToParent = () => {
  router.push(`?sectionId=${currentSections.value.parentSection?.parentId}`);
};

const onAddSubSectionClicked = (section: SectionDto) => {
  router.push(`?sectionId=${section.id}`);
};

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
