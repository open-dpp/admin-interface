<template>
  <div class="overflow-hidden bg-white shadow sm:rounded-lg">
    <div class="px-4 py-6 sm:px-6">
      <h3 class="text-base/7 font-semibold text-gray-900">
        {{ `Abschnitt ${props.section.name}` }}
      </h3>
    </div>
    <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
      <button
        class="block rounded-md bg-indigo-600 px-3 py-1.5 text-center text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        type="button"
        @click="onAddRow"
      >
        Datenreihe hinzufügen
      </button>
    </div>
    <FormKit
      id="repeatable-form"
      type="form"
      v-model="formData"
      @submit="onSubmit"
    >
      <FormKitSchema
        v-if="formSchema"
        :schema="formSchema"
        :library="{ TextField }"
      />
    </FormKit>
  </div>
</template>

<script setup lang="ts">
import { DataValueDto, SectionDto } from "@open-dpp/api-client";
import { onMounted, ref, watch } from "vue";
import { FormKitSchemaNode } from "@formkit/core";
import TextField from "./TextField.vue";
import { RepeatableSectionBuilder, RequestDataValues } from "./section";

const props = defineProps<{
  dataValues: DataValueDto[];
  section: SectionDto;
  modelId: string;
}>();

const emits = defineEmits<{
  (e: "submit", dataValues: RequestDataValues): void;
}>();

const formSchema = ref<FormKitSchemaNode[]>();
const formData = ref<Record<string, unknown>>({});
let sectionBuilder: RepeatableSectionBuilder;

watch(
  () => props,
  (newProps) => {
    sectionBuilder = new RepeatableSectionBuilder(
      newProps.modelId,
      newProps.dataValues,
      newProps.section,
    );
    formSchema.value = sectionBuilder.buildFormRows();
  },
  { deep: true },
);

watch(formSchema, (newSchema) => {
  if (newSchema) {
    formData.value = sectionBuilder.buildFormData();
  }
});

const onAddRow = async () => {
  await sectionBuilder.updateDataValues(formData.value).addRow();
  console.log(sectionBuilder.buildFormRows());
  formSchema.value = sectionBuilder.buildFormRows();
  formData.value = sectionBuilder.buildFormData();
};

const onSubmit = async () => {
  emits(
    "submit",
    sectionBuilder.updateDataValues(formData.value).buildRequestValues(),
  );
};

onMounted(() => {
  sectionBuilder = new RepeatableSectionBuilder(
    props.modelId,
    props.dataValues,
    props.section,
  );
  formSchema.value = sectionBuilder.buildFormRows();
  formData.value = sectionBuilder.buildFormData();
});
</script>
