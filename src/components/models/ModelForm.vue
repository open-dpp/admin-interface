<template>
  <div
    v-if="modelFormStore.productDataModel?.view"
    class="grid grid-cols-1 gap-4"
  >
    <div
      v-for="node of modelFormStore.productDataModel.view.nodes.filter(
        (n) => n.parentId === undefined && isSectionGrid(n),
      )"
      :key="node.id"
    >
      <SectionForm
        v-if="isSectionGrid(node)"
        :sectionGrid="node"
        @submit="onSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { DataValuePatchDto, isSectionGrid } from "@open-dpp/api-client";
import { useModelFormStore } from "../../stores/model.form";
import SectionForm from "./form-components/SectionForm.vue";

const modelFormStore = useModelFormStore();

const onSubmit = async (dataValues: DataValuePatchDto[]) => {
  await modelFormStore.updateModelData(dataValues);
};
</script>
