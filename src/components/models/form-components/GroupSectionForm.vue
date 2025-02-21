<template>
  <div class="overflow-hidden bg-white shadow sm:rounded-lg">
    <div class="px-4 py-6 sm:px-6">
      <h3 class="text-base/7 font-semibold text-gray-900">
        {{ `Abschnitt ${props.section.id}` }}
      </h3>
    </div>
    <FormKit type="form" v-model="formData" @submit="onSubmit">
      <FormKitSchema
        v-if="formSchema"
        :schema="formSchema"
        :library="{ TextField }"
      />
    </FormKit>
  </div>
</template>

<script setup lang="ts">
import {
  DataValueDto,
  DataValuePatchDto,
  SectionDto,
} from "@open-dpp/api-client";
import { onMounted, ref } from "vue";
import { FormKitSchemaNode } from "@formkit/core";
import TextField from "./TextField.vue";
import { RequestDataValues } from "./section";

const props = defineProps<{
  dataValues: DataValueDto[];
  section: SectionDto;
}>();

const emits = defineEmits<{
  (e: "submit", dataValues: RequestDataValues): void;
}>();

const formSchema = ref<FormKitSchemaNode[]>();
const formData = ref<Record<string, unknown>>({});

const onSubmit = async () => {
  emits("submit", {
    PATCH: Object.entries(formData.value).map(([key, value]) => ({
      id: key,
      value,
    })),
  });
};

onMounted(() => {
  formData.value = Object.fromEntries(
    props.dataValues.map((d) => [d.id, d.value]),
  );
  formSchema.value = props.section.dataFields
    .map((f) => {
      const dataValueId = props.dataValues.find(
        (d) => d.dataFieldId === f.id,
      )?.id;
      return {
        $cmp: f.type,
        props: {
          id: dataValueId,
          name: dataValueId,
          label: f.name,
          validation: "required",
        },
      };
    })
    .flat();
});
</script>
