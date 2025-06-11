<template>
  <div v-if="modelFormStore.productDataModel" class="grid grid-cols-1 gap-4">
    <div
      v-for="section of modelFormStore.productDataModel.sections.filter(
        (s) => s.parentId === undefined,
      )"
      :key="section.id"
      class="overflow-hidden bg-white shadow sm:rounded-lg w-full"
    >
      <SectionHeader :section="section" :is-draft-view="false" />
      <div class="p-4">
        <SectionForm :section="section" @submit="onSubmit" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModelFormStore } from "../../stores/model.form";
import SectionForm from "./form-components/SectionForm.vue";
import SectionHeader from "../SectionHeader.vue";

const modelFormStore = useModelFormStore();

const onSubmit = async (dataValues: { id: string; value: unknown }[]) => {
  await modelFormStore.updateModelData(dataValues);
};
</script>
