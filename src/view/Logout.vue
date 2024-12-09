<template>
  <section></section>
</template>

<script lang="ts" setup>
import {onMounted} from "vue";
import keycloakIns from "../lib/keycloak.ts";

onMounted(async () => {
  await keycloakIns.logout({redirectUri: window.location.origin});
})
</script>