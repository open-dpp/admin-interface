<template>
  <section>
    <UserList />
  </section>
</template>
<script lang="ts" setup>
import UserList from "../../components/UserList.vue";
import { onMounted, ref } from "vue";

const members = ref<Array<any>>([]);

onMounted(async () => {
  const res = await fetch("/api/organizations/members");
  members.value = await res.json();
});
</script>
