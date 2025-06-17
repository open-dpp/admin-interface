<template>
  <AasMappingForm />
  <div
    v-for="fieldMapping of integrationStore.aasMapping?.fieldMappings"
    :key="fieldMapping.dataFieldId"
  >
    <div>{{ fieldMapping.dataFieldId }}</div>
  </div>
</template>

<script setup lang="ts">
import { useIntegrationFormStore } from "../../stores/integration.form";
import { onMounted } from "vue";
import AasMappingForm from "./AasMappingForm.vue";

const integrationStore = useIntegrationFormStore();

onMounted(async () => {
  await integrationStore.fetchMapping("7ec33bfd-64a2-4a0f-b266-00e66b7e143e");
});
</script>
