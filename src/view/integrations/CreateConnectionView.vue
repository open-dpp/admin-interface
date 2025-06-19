<template>
  <div class="flex flex-col gap-3 p-3">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold text-gray-900">Verbindung</h1>
        <p class="mt-2 text-sm text-gray-700">
          Erstellen Sie eine neue Verbindung.
        </p>
      </div>
    </div>
    <div>
      <CreateConnectionForm v-if="modelsStore.models" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useModelsStore } from "../../stores/models";
import CreateConnectionForm from "../../components/integrations/CreateConnectionForm.vue";

const modelsStore = useModelsStore();

onMounted(async () => {
  await modelsStore.getModels();
});
</script>
