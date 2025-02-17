<template>
  <FormKit type="form" v-model="formData" @submit="onSubmit">
    <FormKitSchema
      v-if="formSchema"
      :schema="formSchema"
      :data="data"
      :library="{ Section, TextField }"
    />
    <FormKit
      type="text"
      label="Add a city"
      help="Add a city and hit enter"
      v-model="city"
      @keyup.enter="addCity"
    />
  </FormKit>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";

import {
  DataValuePatchDto,
  ModelDto,
} from "@open-dpp/api-client/dist/model.dto";
import { ProductDataModelDto } from "@open-dpp/api-client/dist/product.data.model.dto";
import { FormKitSchemaNode } from "@formkit/core";
import Section from "./form-components/Section.vue";
import TextField from "./form-components/TextField.vue";
import { v4 as uuidv4 } from "uuid";

// Assign the custom component a library
const props = defineProps<{
  model: ModelDto;
  productDataModel: ProductDataModelDto;
}>();

const emits = defineEmits<{
  (e: "submit", dataValues: DataValuePatchDto[]): void;
}>();

const formSchema = ref();
// const formSchema = ref<FormKitSchemaNode[]>();

const formData = ref<Record<string, unknown>>({});

const data = reactive({
  cities: [
    {
      id: "id1",
      name: "Boston",
    },
    {
      id: "id2",
      name: "Man",
    },
  ],
});

const city = ref("");
const addCity = () => {
  const newCity = { id: uuidv4(), name: city.value };
  data.cities.push(newCity);
  formData.value[newCity.id] = newCity.name;
  city.value = "";
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

onMounted(() => {
  formData.value = Object.fromEntries(
    props.model.dataValues.map((d) => [d.id, d.value]),
  );
  for (const city of data.cities) {
    formData.value[city.id] = city.name;
  }
  formSchema.value = props.productDataModel.sections
    .map((s) => {
      if (s.id !== "3c023692-bd15-4ed3-8b28-b5a8c32ec895") {
        return {
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
        };
      } else {
        return {
          $el: "div",
          children: [
            {
              $cmp: "TextField",
              for: ["item", "key", "$cities"],
              props: {
                name: "$: $item.id",
                id: "$: $item.id",
              },
            },
          ],
        };
      }
    })
    .flat();
});
</script>
