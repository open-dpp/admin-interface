<template>
  <section>
    <div class="flex flex-col gap-3 p-3">
      <button
          class="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          type="button">
        <canvas ref="canvas" class="mx-auto h-12 w-12 text-gray-400"/>
        <a :href="url" class="mt-2 block text-sm font-semibold text-gray-900">{{ url }}</a>
      </button>
    </div>
  </section>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {toCanvas} from 'qrcode';
import axiosIns from "../../lib/axios.ts";

const route = useRoute();

const canvas = ref<HTMLCanvasElement>();
const url = ref<string>();

const downloadQrCode = () => {

}

onMounted(async () => {
  const response = await axiosIns.get(`/products/${route.params.productId}`);
  const product = response.data as any;
  url.value = `http://localhost:20009/${product.permalinks[0].uuid}`;
  toCanvas(canvas.value, url.value, (error: any) => {
    console.log(error);
  });
});
</script>
