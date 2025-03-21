<template>
  <form-kit
    class="flex flex-row"
    id="editDataFieldForm"
    v-if="dataFieldForm"
    v-model="dataFieldForm"
    :actions="false"
    @submit="onSave"
    type="form"
  >
    <form-kit
      outer-class="w-full"
      data-cy="name"
      help="Geben Sie Ihrem Datenfeld einen Namen"
      label="Name"
      name="name"
      type="text"
      validation="required"
    />
    <form-kit class="w-full" label="Speichern" type="submit" />
  </form-kit>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useDraftStore } from "../../stores/draft";
import { useIndexStore } from "../../stores";
import { ref, watch } from "vue";

const route = useRoute();
const router = useRouter();
const draftStore = useDraftStore();
const indexStore = useIndexStore();
const dataFieldForm = ref<{ name: string }>();

watch(
  () => route.params.dataFieldId, // The store property to watch
  () => {
    const foundDataField = draftStore.findDataField(
      String(route.params.dataFieldId),
    );
    dataFieldForm.value = foundDataField
      ? { name: foundDataField.name }
      : undefined;
  },
  { immediate: true, deep: true }, // Optional: to run the watcher immediately when the component mounts
);

const onSave = async () => {
  if (dataFieldForm.value) {
    await draftStore.modifyDataField(
      String(route.params.dataFieldId),
      dataFieldForm.value,
    );
    await router.push(
      `/organizations/${indexStore.selectedOrganization}/data-model-drafts/${draftStore.draft?.id}`,
    );
  }
};
</script>
