<template>
  <section>
    <div class="flex flex-col gap-3 p-3">
      <ModelList v-if="modelsStore.models.length > 0" @edit="onSelect" />
      <EmptyState
        :button-label="buttonLabel"
        :button-link="buttonLink"
        v-else
      />
    </div>
  </section>
</template>
<script lang="ts" setup>
import ModelList from "../../components/models/ModelList.vue";
import { onMounted, ref } from "vue";
import { useModelsStore } from "../../stores/models";
import EmptyState from "../../components/models/EmptyState.vue";

const modelsStore = useModelsStore();
const buttonLabel = "Neues Modell hinzufügen";
const buttonLink = "/models/create";

const selectedProductId = ref<string>();

const onSelect = async (productId: string) => {
  selectedProductId.value = productId;
};

onMounted(async () => {
  await modelsStore.getModels();
});
</script>
