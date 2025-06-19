<template>
  <div
    v-if="passportFormStore.productDataModel"
    class="mb-4 grid grid-cols-1 gap-4"
  >
    <div
      v-for="section of passportFormStore.productDataModel.sections.filter(
        (s) => s.parentId === undefined,
      )"
      :key="section.id"
      :data-cy="`section-card-${section.id}`"
      class="overflow-hidden bg-white shadow sm:rounded-lg w-full"
    >
      <SectionHeader :section="section" :is-draft-view="false" />
      <div
        v-if="
          section.granularityLevel === passportFormStore.granularityLevel ||
          !section.granularityLevel
        "
        class="p-4"
      >
        <SectionForm :section="section" @submit="onSubmit" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePassportFormStore } from "../../stores/passport.form";
import SectionForm from "./form-components/SectionForm.vue";
import SectionHeader from "../SectionHeader.vue";
import { useNotificationStore } from "../../stores/notification";
import { logError } from "../logging/logging";

const passportFormStore = usePassportFormStore();
const notificationStore = useNotificationStore();

const onSubmit = async (dataValues: { id: string; value: unknown }[]) => {
  try {
    await passportFormStore.updateDataValues(dataValues);
    notificationStore.addSuccessNotification("Daten erfolgreich gespeichert");
  } catch (e) {
    const message = "Daten konnten nicht gespeichert werden";
    notificationStore.addErrorNotification(message);
    logError(message, e);
  }
};
</script>
