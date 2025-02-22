<template>
  <div class="overflow-hidden bg-white shadow sm:rounded-lg">
    <div class="px-4 py-6 sm:px-6">
      <div>
        <h3 class="text-base/7 font-semibold text-gray-900">
          {{ `Abschnitt ${props.section.name}` }}
        </h3>
      </div>
      <FormKit
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
        <FormKit label="Speichern" type="submit" />
      </FormKit>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DataValuePatchDto, SectionDto } from "@open-dpp/api-client";
import { ref, watch } from "vue";
import TextField from "./TextField.vue";
import { useModelFormStore } from "../../../stores/model.form";

const props = defineProps<{
  section: SectionDto;
}>();

const modelFormStore = useModelFormStore();

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
