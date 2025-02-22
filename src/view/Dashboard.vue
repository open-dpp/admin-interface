<template>
  <section>
    <div class="flex flex-col gap-3 px-3">
      <FastActions
        v-if="indexStore.selectedOrganization"
        :organization-id="indexStore.selectedOrganization"
      />
    </div>
  </section>
</template>
<script lang="ts" setup>
import FastActions from "../components/FastActions.vue";
import { useIndexStore } from "../stores";

const indexStore = useIndexStore();
</script>
