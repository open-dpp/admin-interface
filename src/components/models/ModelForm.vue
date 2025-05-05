<template>
  <div v-if="modelFormStore.productDataModel" class="grid grid-cols-1 gap-4">
    <div
      v-for="section of modelFormStore.productDataModel.sections.filter(
        (s) => s.parentId === undefined,
      )"
      :key="section.id"
    >
      <SectionForm :section="section" @submit="onSubmit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { DataValuePatchDto } from "@open-dpp/api-client";
import { useModelFormStore } from "../../stores/model.form";
import SectionForm from "./form-components/SectionForm.vue";

const modelFormStore = useModelFormStore();

const onSubmit = async (dataValues: DataValuePatchDto[]) => {
  await modelFormStore.updateModelData(dataValues);
};
</script>
