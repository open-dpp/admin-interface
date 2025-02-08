<template>
  <div class="">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold text-gray-900">Produkt</h1>
        <p class="mt-2 text-sm text-gray-700">
          Erstellen Sie eine neues Produkt.
        </p>
      </div>
    </div>
    <div class="mt-8 flow-root">
      <CreateModelForm />
    </div>
  </div>
</template>

<script lang="ts" setup>
import CreateModelForm from "../../components/models/CreateModelForm.vue";
</script>
