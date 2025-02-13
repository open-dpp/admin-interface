<template>
  <FormKit type="form" v-model="formData" @submit="onSubmit">
    <FormKitSchema v-if="formSchema" :schema="formSchema" />
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
        $el: "h1",
        children: ["Section", s.id],
      },
      ...s.dataFields
        .map((f) => ({
          $formkit: "text",
          name: props.model.dataValues.find((d) => d.dataFieldId === f.id)?.id,
          label: f.name,
          validation: "required",
        }))
        .flat(),
    ])
    .flat();
});
</script>
