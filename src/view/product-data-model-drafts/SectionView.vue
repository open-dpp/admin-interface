<template>
  <form-kit
    class="flex flex-row"
    id="editSectionForm"
    v-if="sectionForm"
    v-model="sectionForm"
    :actions="false"
    @submit="onSave"
    type="form"
  >
    <form-kit
      outer-class="w-full"
      data-cy="name"
      help="Geben Sie Ihrem Abschnitt einen Namen"
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
import { ref, watch } from "vue";
import { useIndexStore } from "../../stores";

const route = useRoute();
const router = useRouter();
const draftStore = useDraftStore();
const indexStore = useIndexStore();
const sectionForm = ref<{ name: string }>();

watch(
  () => route.params.sectionId, // The store property to watch
  () => {
    const foundSection = draftStore.draft?.sections.find(
      (s) => s.id === route.params.sectionId,
    );
    sectionForm.value = foundSection ? { name: foundSection.name } : undefined;
  },
  { immediate: true, deep: true }, // Optional: to run the watcher immediately when the component mounts
);

const onSave = async () => {
  if (sectionForm.value) {
    await draftStore.modifySection(
      String(route.params.sectionId),
      sectionForm.value,
    );
    await router.push(
      `/organizations/${indexStore.selectedOrganization}/data-model-drafts/${draftStore.draft?.id}`,
    );
  }
};
</script>
