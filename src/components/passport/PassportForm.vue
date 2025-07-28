<template>
  <div v-if="passportFormStore.template" class="mb-4 grid grid-cols-1 gap-4">
    <div
      v-for="section of passportFormStore.template.sections.filter(
        (s) => s.parentId === undefined,
      )"
      :key="section.id"
      :data-cy="`section-card-${section.id}`"
      class="overflow-hidden bg-white shadow sm:rounded-lg w-full"
    >
      <SectionHeader :section="section" />
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
import { useErrorHandlingStore } from "../../stores/error.handling";

const passportFormStore = usePassportFormStore();
const notificationStore = useNotificationStore();
const errorHandlingStore = useErrorHandlingStore();

const onSubmit = async (dataValues: { id: string; value: unknown }[]) => {
  try {
    await passportFormStore.updateDataValues(dataValues);
    notificationStore.addSuccessNotification("Daten erfolgreich gespeichert");
  } catch (e) {
    errorHandlingStore.logErrorWithNotification(
      "Daten konnten nicht gespeichert werden",
      e,
    );
  }
};
</script>
