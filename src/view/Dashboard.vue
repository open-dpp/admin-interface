<template>
  <section>
    <div class="flex flex-col gap-3 px-3">
      <FastActions/>
      <BentoGridHome/>
    </div>
  </section>
</template>
<script lang="ts" setup>

import BentoGridHome from "../components/BentoGridHome.vue";
import FastActions from "../components/FastActions.vue";
</script>