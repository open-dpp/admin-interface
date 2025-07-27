<template>
  <div class="flex flex-col gap-4">
    <div>Modellpassvorlagen</div>
    <div>
      <Tabs />
    </div>
    <div>
      <AdvancedListSelector
        v-if="templates"
        :headers="['ID', 'Name', 'Version']"
        :items="templates"
        :pagination="{
          rowsPerPage: 5,
        }"
        :row-actions="actions"
        :selected="selected"
        :selection="{
          multiple: false,
        }"
        :show-options="true"
        @update-selected-items="selected = $event"
      >
        <template #row="{ item }">
          <td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
            {{ (item as TemplateGetAllDto).name }}
          </td>
          <td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
            {{ (item as TemplateGetAllDto).version }}
          </td>
        </template>
      </AdvancedListSelector>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useModelsStore } from "../../stores/models";
import { useIndexStore } from "../../stores";
import AdvancedListSelector from "../lists/AdvancedListSelector.vue";
import apiClient from "../../lib/api-client";
import { TemplateGetAllDto } from "@open-dpp/api-client";
import Tabs from "../lists/Tabs.vue";

const indexStore = useIndexStore();
const modelsStore = useModelsStore();

const templates = ref<TemplateGetAllDto[]>();
const selected = ref<TemplateGetAllDto[]>();

const actions = [
  {
    name: "Artikelpässe",
    actionLinkBuilder: (row: Record<string, string>) =>
      `/organizations/${indexStore.selectedOrganization}/models/${row.id}/items`,
  },
  {
    name: "Editieren",
    actionLinkBuilder: (row: Record<string, string>) =>
      `/organizations/${indexStore.selectedOrganization}/models/${row.id}`,
  },
  {
    name: "QR-Code",
    actionLinkBuilder: (row: Record<string, string>) =>
      `/organizations/${indexStore.selectedOrganization}/models/${row.id}/qr-code`,
  },
];

onMounted(async () => {
  await modelsStore.getModels();
  const response = await apiClient.dpp.templates.getAll();
  templates.value = response.data;
  const marketplaceResponse =
    await apiClient.marketplace.passportTemplates.getAll();
  console.log(marketplaceResponse);
});
</script>
