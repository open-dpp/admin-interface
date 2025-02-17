<template>
  <form-kit
    id="createProductForm"
    :actions="false"
    outer-class="w-full"
    type="form"
    @submit="create"
  >
    <form-kit
      :allow-incomplete="false"
      :wrapper-class="{ 'w-full': true }"
      name="stepper"
      tab-style="tab"
      type="multi-step"
    >
      <form-kit
        :wrapper-class="{ 'w-full': true }"
        label="Allgemein"
        name="generalInfo"
        type="step"
      >
        <form-kit
          help="Geben Sie Ihrem Modell einen Namen"
          label="Name"
          name="name"
          type="text"
          validation="required"
          data-cy="name"
        />
        <form-kit
          help="Wählen Sie das Datenmodell aus"
          label="Datenmodell"
          name="productDataModelId"
          data-cy="productDataModelId"
          type="select"
          validation="required"
          :options="selectableDataModels"
        />
        <template #stepNext>
          <FormKit label="Erstellen" type="submit" />
        </template>
      </form-kit>
    </form-kit>
  </form-kit>
</template>

<script lang="ts" setup>
import { ProductDataModelGetAllDto } from "@open-dpp/api-client";

const props = defineProps<{ productDataModels: ProductDataModelGetAllDto[] }>();
const selectableDataModels = props.productDataModels.map((p) => ({
  label: p.name,
  value: p.id,
}));

const emits = defineEmits<{
  (e: "submit", selectedProductDataModelId: string, modelName: string): void;
}>();

const create = async (fields: {
  stepper: {
    generalInfo: {
      name: string;
      productDataModelId: string;
    };
  };
}) => {
  emits(
    "submit",
    fields.stepper.generalInfo.productDataModelId,
    fields.stepper.generalInfo.name,
  );
};
</script>
