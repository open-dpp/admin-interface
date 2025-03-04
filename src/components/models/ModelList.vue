<template>
  <div class="">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold text-gray-900">Modelle</h1>
        <p class="mt-2 text-sm text-gray-700">Alle erstellten Modelle</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
          v-if="indexStore.selectedOrganization"
          class="block rounded-md bg-indigo-600 px-3 py-1.5 text-center text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          type="button"
        >
          <router-link
            :to="`/organizations/${indexStore.selectedOrganization}/models/create`"
            >Modell hinzufügen
          </router-link>
        </button>
      </div>
    </div>
    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div class="relative">
            <div
              v-if="selectedModels.length > 0"
              class="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-white sm:left-12"
            >
              <button
                class="inline-flex items-center rounded-sm bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                type="button"
              >
                Alle bearbeiten
              </button>
              <button
                class="inline-flex items-center rounded-sm bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                type="button"
              >
                Alle löschen
              </button>
            </div>
            <table class="min-w-full table-fixed divide-y divide-gray-300">
              <thead>
                <tr>
                  <th class="relative px-7 sm:w-12 sm:px-6" scope="col">
                    <input
                      :checked="
                        indeterminate || selectedModels.length === models.length
                      "
                      :indeterminate="indeterminate"
                      class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      type="checkbox"
                      @change="
                        (event) =>
                          onChange((event.target as HTMLInputElement).checked)
                      "
                    />
                  </th>
                  <th
                    class="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                    scope="col"
                  >
                    ID
                  </th>
                  <th
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    scope="col"
                  >
                    Name
                  </th>
                  <th
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    scope="col"
                  >
                    Beschreibung
                  </th>
                  <th
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    scope="col"
                  >
                    Erstellt am
                  </th>
                  <th class="relative py-3.5 pl-3 pr-4 sm:pr-3" scope="col">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr
                  v-for="model in models"
                  :key="model.id"
                  :class="[
                    selectedModels.includes(model.id) && 'bg-gray-50',
                    'cursor-pointer',
                  ]"
                  @click="emits('edit', model.id)"
                >
                  <td class="relative px-7 sm:w-12 sm:px-6">
                    <div
                      v-if="selectedModels.includes(model.id)"
                      class="absolute inset-y-0 left-0 w-0.5 bg-indigo-600"
                    ></div>
                    <input
                      v-model="selectedModels"
                      :value="model.id"
                      class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      type="checkbox"
                    />
                  </td>
                  <td
                    :class="[
                      'whitespace-nowrap py-4 pr-3 text-sm font-medium',
                      selectedModels.includes(model.id)
                        ? 'text-indigo-600'
                        : 'text-gray-900',
                    ]"
                  >
                    {{ model.id }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ model.name }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ model.description }}
                  </td>
                  <td
                    class="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 gap-4 flex flex-row"
                  >
                    <router-link
                      :to="`/organizations/${indexStore.selectedOrganization}/models/${model.id}/items`"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      Artikel
                    </router-link>
                    <router-link
                      :to="`/organizations/${indexStore.selectedOrganization}/models/${model.id}`"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      Details<span class="sr-only">, {{ model.id }}</span>
                    </router-link>
                    <router-link
                      :to="`/organizations/${indexStore.selectedOrganization}/models/${model.id}/qr-code`"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      QR-Code<span class="sr-only">, {{ model.id }}</span>
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useModelsStore } from "../../stores/models";
import { useIndexStore } from "../../stores";

const indexStore = useIndexStore();
const modelsStore = useModelsStore();

const emits = defineEmits<{
  (e: "add"): void;
  (e: "edit", modelId: string): void;
}>();

const selectedModels = ref<string[]>([]);

const models = computed(() => {
  return modelsStore.models;
});

const indeterminate = computed(
  () =>
    selectedModels.value.length > 0 &&
    selectedModels.value.length < models.value.length,
);

const onChange = (isChecked: boolean) => {
  selectedModels.value = isChecked ? models.value.map((p) => p.id) : [];
};

onMounted(async () => {
  await modelsStore.getModels();
});
</script>
