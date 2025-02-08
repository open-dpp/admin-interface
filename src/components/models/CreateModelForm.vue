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
          help="Geben Sie Ihrem Produkt einen Namen"
          label="Name"
          name="name"
          type="text"
          validation="required"
        />
        <template #stepNext>
          <FormKit label="Erstellen" type="submit" />
        </template>
      </form-kit>
    </form-kit>
  </form-kit>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { reset } from "@formkit/core";
import { useModelsStore } from "../../stores/models.ts";
import { useRouter } from "vue-router";

const modelsStore = useModelsStore();
const router = useRouter();

const submitted = ref(false);

const create = async (fields: {
  stepper: {
    generalInfo: {
      name: string;
    };
  };
}) => {
  await modelsStore.createModel({
    name: fields.stepper.generalInfo.name,
  });
  new Promise((resolve) => setTimeout(resolve, 250));
  submitted.value = true;
  reset("createProductForm");
  await modelsStore.getModels();
  router.push("/models");
};
</script>
