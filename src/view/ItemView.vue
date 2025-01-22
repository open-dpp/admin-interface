<template>
  <section>
    <div class="flex flex-col gap-3 p-3">
      <div v-if="items">
        <ItemList :items="items" @add="onAdd" />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import axiosIns from "../lib/axios.ts";
import Item from "../types/Item.ts";
import ItemList from "../components/products/ItemList.vue";

const route = useRoute();

const items = ref<Item[]>([]);

const fetchItems = async () => {
  const response = await axiosIns.get(`/models/${route.params.modelId}/items`);
  items.value = response.data;
};

const onAdd = async () => {
  await axiosIns.post(`/models/${route.params.modelId}/items`);
  await fetchItems();
};

onMounted(async () => {
  await fetchItems();
});
</script>
