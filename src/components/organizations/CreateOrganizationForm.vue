<template>
  <form-kit
    id="createOrganizationForm"
    type="form"
    @submit="create"
    :actions="false"
    outer-class="w-full"
  >
    <form-kit
      name="stepper"
      type="multi-step"
      tab-style="tab"
      :allow-incomplete="false"
      :wrapper-class="{ 'w-full': true }"
    >
      <form-kit
        type="step"
        name="generalInfo"
        label="Allgemein"
        :wrapper-class="{ 'w-full': true }"
      >
        <form-kit
          type="text"
          label="Name"
          name="name"
          help="Geben Sie Ihrer Organisation einen Namen"
          validation="required"
        />
        <template #stepNext>
          <FormKit type="submit" label="Erstellen" />
        </template>
      </form-kit>
    </form-kit>
  </form-kit>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { reset } from "@formkit/core";
import { useOrganizationsStore } from "../../stores/organizations";
import { useIndexStore } from "../../stores";

const indexStore = useIndexStore();
const organizationStore = useOrganizationsStore();

const submitted = ref(false);

const create = async (fields: {
  stepper: {
    generalInfo: {
      name: string;
    };
  };
}) => {
  const responseData = await organizationStore.createOrganization({
    name: fields.stepper.generalInfo.name,
  });
  new Promise((resolve) => setTimeout(resolve, 250));
  submitted.value = true;
  reset("createOrganizationForm");
  await organizationStore.fetchOrganizations();
  indexStore.selectOrganization(responseData.id);
};
</script>
