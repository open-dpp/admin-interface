<template>
  <section>
    <div class="flex flex-col gap-3 p-3">
      <button
        class="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        type="button"
      >
        <canvas ref="canvas" class="mx-auto h-12 w-12 text-gray-400" />
        <a
          :href="props.url"
          class="mt-2 block text-sm font-semibold text-gray-900"
          >{{ props.url }}</a
        >
      </button>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { toCanvas } from "qrcode";
import { onMounted, ref } from "vue";
const canvas = ref<HTMLCanvasElement>();
const props = defineProps<{
  url: string;
}>();
onMounted(async () => {
  toCanvas(canvas.value, props.url, () => {});
});
</script>
