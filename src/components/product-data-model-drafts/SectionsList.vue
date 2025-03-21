<template>
  <div class="">
    <!--    <ListHeader-->
    <!--      entity-name="Datenmodellentwürfe"-->
    <!--      :creation-link="`/organizations/${indexStore.selectedOrganization}/data-model-drafts/create`"-->
    <!--      creation-label="Datenmodell entwerfen"-->
    <!--    />-->
    <SimpleTable
      :headers="['Name']"
      :rows="rows"
      :row-actions="[]"
      :ignoreRowKeys="['id']"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import SimpleTable from "../lists/SimpleTable.vue";
import { SectionDraftDto } from "@open-dpp/api-client";

const props = defineProps<{
  sections: SectionDraftDto[];
}>();

const rows = computed(() => {
  return props.sections.map((s) => ({ id: s.id, name: s.name }));
});
</script>
