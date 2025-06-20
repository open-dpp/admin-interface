<template>
  <div class="flex flex-col gap-3">
    <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
      <div class="px-4 py-6 sm:px-6">
        <h3 class="text-base/7 font-semibold text-gray-900">
          Verbindungsinformationen
        </h3>
      </div>
      <div
        v-if="aasConnectionFormStore.aasConnection"
        class="border-t border-gray-100"
      >
        <dl class="divide-y divide-gray-100">
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-900">ID</dt>
            <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              {{ aasConnectionFormStore.aasConnection.id }}
            </dd>
          </div>
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-900">Name</dt>
            <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              {{ aasConnectionFormStore.aasConnection.name }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
    <div
      v-if="
        aasConnectionFormStore.aasConnection &&
        !aasConnectionFormStore.fetchInFlight
      "
      class="flex justify-between items-center border-b border-gray-900/5 bg-gray-50"
    >
      <div class="flex items-center gap-2">
        <div class="text-sm/6 font-medium text-gray-900">Feldverknüpfungen</div>
      </div>
      <button
        class="m-2 block rounded-md bg-indigo-600 px-3 py-1.5 text-center text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        type="button"
        @click="aasConnectionFormStore.addFieldAssignmentRow"
      >
        Feldverknüpfung hinzufügen
      </button>
    </div>
    <AasConnectionForm
      v-if="
        aasConnectionFormStore.aasConnection &&
        !aasConnectionFormStore.fetchInFlight
      "
    />
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useRoute } from "vue-router";
import { useAasConnectionFormStore } from "../../stores/aas.connection.form";
import AasConnectionForm from "../../components/integrations/AasConnectionForm.vue";

const route = useRoute();
const aasConnectionFormStore = useAasConnectionFormStore();

watch(
  () => [route.params.connectionId], // The store property to watch
  async () => {
    await aasConnectionFormStore.fetchConnection(
      String(route.params.connectionId),
    );
  },
  { immediate: true }, // Optional: to run the watcher immediately when the component mounts
);
</script>
