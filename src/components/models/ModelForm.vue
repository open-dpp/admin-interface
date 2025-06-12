<template>
  <div v-if="modelFormStore.productDataModel" class="grid grid-cols-1 gap-4">
    <div
      v-for="section of modelFormStore.productDataModel.sections.filter(
        (s) => s.parentId === undefined,
      )"
      :key="section.id"
      :data-cy="`section-card-${section.id}`"
      class="overflow-hidden bg-white shadow sm:rounded-lg w-full"
    >
      <SectionHeader
        :section="section"
        :is-draft-view="false"
        :disabled="section.granularityLevel === GranularityLevel.ITEM"
      />
      <div
        v-if="
          section.granularityLevel === GranularityLevel.MODEL ||
          section.granularityLevel === undefined
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
import { GranularityLevel } from "../../../../open-dpp-api-client/src";

const modelFormStore = usePassportFormStore();

const onSubmit = async (dataValues: { id: string; value: unknown }[]) => {
  await modelFormStore.updateDataValues(dataValues);
};
</script>
