<template>
  <div
    v-for="section of modelFormStore.productDataModel?.sections"
    v-bind:key="section.id"
  >
    <RepeatableSectionForm
      v-if="section.type == SectionType.REPEATABLE"
      :section="section"
      @submit="onSubmit"
    />
    <GroupSectionForm v-else :section="section" @submit="onSubmit" />
  </div>
</template>

<script setup lang="ts">
import { DataValuePatchDto, SectionType } from "@open-dpp/api-client";
import RepeatableSectionForm from "./form-components/RepeatableSectionForm.vue";
import { useModelFormStore } from "../../stores/model.form";
import GroupSectionForm from "./form-components/GroupSectionForm.vue";

const modelFormStore = useModelFormStore();

const onSubmit = async (dataValues: DataValuePatchDto[]) => {
  await modelFormStore.updateModelData(dataValues);
};
</script>
