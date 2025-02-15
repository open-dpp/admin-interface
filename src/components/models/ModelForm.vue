<template>
  <FormKit type="form" v-model="formData" @submit="onSubmit">
    <FormKitSchema
      v-if="formSchema"
      :schema="formSchema"
      :library="{ Section, TextField }"
    />
  </FormKit>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import {
  DataValuePatchDto,
  ModelDto,
} from "@open-dpp/api-client/dist/model.dto";
import { ProductDataModelDto } from "@open-dpp/api-client/dist/product.data.model.dto";
import { FormKitSchemaNode } from "@formkit/core";
import Section from "./form-components/Section.vue";
import TextField from "./form-components/TextField.vue";

// Assign the custom component a library
const props = defineProps<{
  model: ModelDto;
  productDataModel: ProductDataModelDto;
}>();

const emits = defineEmits<{
  (e: "submit", dataValues: DataValuePatchDto[]): void;
}>();

const formSchema = ref<FormKitSchemaNode[]>();
const formData = ref<Record<string, unknown>>({});

const onSubmit = async () => {
  emits(
    "submit",
    Object.entries(formData.value).map(([key, value]) => ({
      id: key,
      value,
    })),
  );
};

onMounted(() => {
  formData.value = Object.fromEntries(
    props.model.dataValues.map((d) => [d.id, d.value]),
  );
  formSchema.value = props.productDataModel.sections
    .map((s) => [
      {
        $cmp: "Section",
        props: {
          label: s.id,
        },
        children: [
          ...s.dataFields
            .map((f) => {
              const dataValueId = props.model.dataValues.find(
                (d) => d.dataFieldId === f.id,
              )?.id;
              return {
                $cmp: "TextField",
                props: {
                  id: dataValueId,
                  name: dataValueId,
                  label: f.name,
                  validation: "required",
                },
              };
            })
            .flat(),
        ],
      },
    ])
    .flat();
});
</script>
