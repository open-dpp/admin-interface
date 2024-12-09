<template>
  <section>
    <div class="flex flex-col gap-5 p-3">
      <PageHeader/>
      <Stats/>
    </div>
  </section>
</template>
<script lang="ts" setup>

import PageHeader from "../components/stats/PageHeader.vue";
import Stats from "../components/stats/Stats.vue";
</script>