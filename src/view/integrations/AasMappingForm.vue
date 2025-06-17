<template>
  <FormKit v-model="formData" :actions="false" type="form" @submit="onSubmit">
    <FormKitSchema v-if="formSchema" :schema="formSchema" />
    <FormKit label="Speichern" type="submit" />
  </FormKit>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useIntegrationFormStore } from "../../stores/integration.form";

const integrationStore = useIntegrationFormStore();
const formData = ref<Record<string, unknown>>({});
const formSchema = ref();

watch(
  () => integrationStore.aasMapping?.fieldMappings, // The store property to watch
  () => {
    formSchema.value = integrationStore.getFormSchema();
    formData.value = integrationStore.getFormData();
    // formData.value = passportFormStore.getFormData(
    //   props.section.id,
    //   formData.value,
    // );
  },
  { immediate: true, deep: true }, // Optional: to run the watcher immediately when the component mounts
);

const onSubmit = async () => {};
</script>
