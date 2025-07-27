<template>
  <div class="">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold text-gray-900">Modellpass</h1>
        <p class="mt-2 text-sm text-gray-700">
          Erstellen Sie einen neuen Modellpass.
        </p>
      </div>
    </div>
    <div class="mt-8 flex flex-col gap-10">
      <div class="flex items-center">
        <div class="flex-auto">
          <form-kit
            data-cy="name"
            help="Geben Sie Ihrem Modellpass einen Namen"
            label="Name"
            name="name"
            type="text"
            validation="required"
          />
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            class="block rounded-md bg-indigo-600 px-3 py-1.5 text-center text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            type="button"
            @click="onSubmit"
          >
            Modelpass erstellen
          </button>
        </div>
      </div>
      <div>
        <ModelTemplateList />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import apiClient from "../../lib/api-client";
import { useRouter } from "vue-router";
import { TemplateGetAllDto } from "@open-dpp/api-client";
import ModelTemplateList from "../../components/models/ModelTemplateList.vue";
import axiosIns from "../../lib/axios";
import { useIndexStore } from "../../stores";

const indexStore = useIndexStore();

const props = defineProps<{
  organizationId: string;
}>();

const templates = ref<TemplateGetAllDto[]>();
const router = useRouter();

const onSubmit = async () => {
  const templateId = "";
  const modelName = "";

  const response = await apiClient.dpp.models.create({
    name: modelName,
    templateId,
  });

  await router.push(
    `/organizations/${props.organizationId}/models/${response.data.id}`,
  );
};

onMounted(async () => {
  const response = await apiClient.dpp.templates.getAll();
  templates.value = response.data;

  await axiosIns.get(
    `https://marketplace.open-dpp.localhost:20080/organizations/${indexStore.selectedOrganization}/templates/passports`,
  );
});
</script>
