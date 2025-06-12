<template>
  <FormKit v-model="formData" :actions="false" type="form" @submit="onSubmit">
    <FormKitSchema
      v-if="formSchema"
      :library="{ TextField }"
      :schema="formSchema"
    />
    <FormKit label="Speichern" type="submit" />
  </FormKit>
</template>

<script lang="ts" setup>
import { SectionDto, SectionType } from "@open-dpp/api-client";
import { ref, watch } from "vue";
import TextField from "./TextField.vue";
import { usePassportFormStore } from "../../../stores/passport.form";

const props = defineProps<{
  section: SectionDto;
}>();

const passportFormStore = usePassportFormStore();

const emits = defineEmits<{
  (e: "submit", dataValues: { id: string; value: unknown }[]): void;
}>();

const formData = ref<Record<string, unknown>>({});
const formSchema = ref();

watch(
  () => passportFormStore.passport?.dataValues, // The store property to watch
  () => {
    formSchema.value =
      props.section.type === SectionType.REPEATABLE
        ? passportFormStore.getFormSchemaRepeatable(props.section)
        : passportFormStore.getFormSchema(props.section);
    formData.value = passportFormStore.getFormData(
      props.section.id,
      formData.value,
    );
  },
  { immediate: true, deep: true }, // Optional: to run the watcher immediately when the component mounts
);

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
