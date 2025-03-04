<template>
  <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
    <div class="px-4 py-6 sm:px-6">
      <div class="px-4 py-6 sm:px-6 flex flex-row justify-between w-full">
        <h3 class="text-base/7 font-semibold text-gray-900">
          {{ `Abschnitt ${props.section.name}` }}
        </h3>
        <button
          class="block rounded-md bg-indigo-600 px-3 py-1.5 text-center text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          type="button"
          @click="onAddRow"
        >
          Datenreihe hinzufügen
        </button>
      </div>
      <FormKit
        id="repeatable-form"
        v-model="formData"
        :actions="false"
        type="form"
        @submit="onSubmit"
      >
        <FormKitSchema
          v-if="formSchema"
          :library="{ TextField }"
          :schema="formSchema"
        />
        <FormKit v-if="formSchema.length > 0" label="Speichern" type="submit" />
      </FormKit>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DataValuePatchDto, SectionDto } from "@open-dpp/api-client";
import { ref, watch } from "vue";
import TextField from "./TextField.vue";
import { useModelFormStore } from "../../../stores/model.form";

const modelFormStore = useModelFormStore();

const props = defineProps<{ section: SectionDto }>();

const emits = defineEmits<{
  (e: "submit", dataValues: DataValuePatchDto[]): void;
}>();

const formData = ref<Record<string, unknown>>({});
const formSchema = ref();

watch(
  () => modelFormStore.model?.dataValues, // The store property to watch
  () => {
    formSchema.value = modelFormStore.getFormSchema(props.section.id);
    formData.value = modelFormStore.getFormData(
      props.section.id,
      formData.value,
    );
  },
  { immediate: true, deep: true }, // Optional: to run the watcher immediately when the component mounts
);

const onAddRow = async () => {
  await modelFormStore.addRowToSection(props.section.id);
};

const onSubmit = async () => {
  emits(
    "submit",
    Object.entries(formData.value).map(([key, value]) => ({
      id: key,
      value,
    })),
  );
};
</script>
