<template>
  <form-kit id="createDraftForm" :actions="false" type="form" @submit="create">
    <form-kit
      data-cy="name"
      help="Geben Sie Ihrem Produktpass Design einen Namen"
      label="Name"
      name="name"
      type="text"
      validation="required"
    />
    <form-kit label="Erstellen" type="submit" />
  </form-kit>
</template>

<script lang="ts" setup>
const emits = defineEmits<{
  (e: "submit", draftName: string): void;
}>();

const create = async (fields: { name: string }) => {
  emits("submit", fields.name);
};
</script>
