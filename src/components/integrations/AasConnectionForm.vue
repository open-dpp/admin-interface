<template>
  <FormKit v-model="formData" :actions="false" type="form" @submit="onSubmit">
    <FormKitSchema v-if="formSchema" :schema="formSchema" />
    <FormKit label="Speichern" type="submit" />
  </FormKit>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useAasConnectionFormStore } from "../../stores/aas.connection.form";

const aasConnectionFormStore = useAasConnectionFormStore();
const formData = ref<Record<string, string>>({});
const formSchema = ref();

watch(
  () => aasConnectionFormStore.aasConnection?.id, // The store property to watch
  () => {
    formSchema.value = aasConnectionFormStore.getFormSchema();
    formData.value = aasConnectionFormStore.getFormData();
  },
  { immediate: true },
);

const onSubmit = async () => {
  if (formData.value) {
    await aasConnectionFormStore.modifyConnection({
      fieldAssignments: formData.value,
    });
  }
};
</script>
