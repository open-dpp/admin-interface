<template>
  <QrCode v-if="url" :url="url" />
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import axiosIns from "../../lib/axios";
import { VIEW_ROOT_URL } from "../../const";
import QrCode from "../../components/QrCode.vue";

const route = useRoute();
const url = ref<string>();

onMounted(async () => {
  const response = await axiosIns.get(
    `/models/${route.params.modelId}/items/${route.params.itemId}`,
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const item = response.data as any;
  url.value = `${VIEW_ROOT_URL}/${item.uniqueProductIdentifiers[0].uuid}`;
});
</script>
