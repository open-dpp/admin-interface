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

const passportFormStore = usePassportFormStore();

const onSubmit = async (dataValues: { id: string; value: unknown }[]) => {
  await passportFormStore.updateDataValues(dataValues);
};
</script>
