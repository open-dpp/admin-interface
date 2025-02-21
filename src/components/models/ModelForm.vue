<template>
  <div
    v-for="section of props.productDataModel.sections"
    v-bind:key="section.id"
  >
    <RepeatableSectionForm
      :model-id="model.id"
      v-if="section.type == SectionType.REPEATABLE"
      :data-values="
        props.model.dataValues.filter((s) => s.dataSectionId === section.id)
      "
      :section="section"
      @submit="onSubmit"
    />
    <GroupSectionForm
      v-else
      :data-values="
        props.model.dataValues.filter((s) => s.dataSectionId === section.id)
      "
      :section="section"
      @submit="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ModelDto,
  ProductDataModelDto,
  SectionType,
} from "@open-dpp/api-client";
import GroupSectionForm from "./form-components/GroupSectionForm.vue";
import RepeatableSectionForm from "./form-components/RepeatableSectionForm.vue";
import { RequestDataValues } from "./form-components/section";

// Assign the custom component a library
const props = defineProps<{
  model: ModelDto;
  productDataModel: ProductDataModelDto;
}>();

const emits = defineEmits<{
  (e: "submit", dataValues: RequestDataValues): void;
}>();

const onSubmit = (dataValues: RequestDataValues) => {
  emits("submit", dataValues);
};
</script>
