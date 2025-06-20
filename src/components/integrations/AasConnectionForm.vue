<template>
  <FormKit
    v-model="aasConnectionFormStore.formData"
    :actions="false"
    type="form"
    @submit="onSubmit"
  >
    <FormKitSchema
      v-if="aasConnectionFormStore.formSchema"
      :schema="aasConnectionFormStore.formSchema"
    />
    <FormKit label="Speichern" type="submit" />
  </FormKit>
</template>

<script setup lang="ts">
import { useAasConnectionFormStore } from "../../stores/aas.connection.form";
import { computed, onMounted } from "vue";
import { useModelsStore } from "../../stores/models";

const aasConnectionFormStore = useAasConnectionFormStore();

const modelsStore = useModelsStore();

const selectableModels = computed(() =>
  modelsStore.models.map((m) => ({ label: `${m.name} ${m.id}`, value: m.id })),
);

const onSubmit = async () => {
  //if (formData.value) {
  await aasConnectionFormStore.submitModifications();
};

onMounted(async () => {
  await modelsStore.getModels();
});
</script>
