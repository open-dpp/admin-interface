<template>
  <div
    v-if="props.notification"
    class="pointer-events-auto overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5"
  >
    <div class="p-4">
      <div class="flex items-start">
        <div class="shrink-0">
          <CheckCircleIcon class="size-6 text-green-400" aria-hidden="true" />
        </div>
        <div class="ml-3 w-0 flex-1 pt-0.5">
          <p class="text-sm font-medium text-gray-900">Erfolg</p>
          <p class="mt-1 text-sm text-gray-500">
            {{ props.notification.message }}
          </p>
          <div v-if="props.notification.actionLink" class="mt-3 flex space-x-7">
            <router-link
              type="button"
              :to="props.notification.actionLink.to"
              class="rounded-md bg-white text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {{ props.notification.actionLink.label }}
            </router-link>
          </div>
        </div>
        <div class="ml-4 flex shrink-0">
          <button
            :data-cy="`closeNotification-${props.notification.id}`"
            type="button"
            @click="onDelete"
            class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span class="sr-only">Close</span>
            <XMarkIcon class="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { CheckCircleIcon } from "@heroicons/vue/24/outline";
import { XMarkIcon } from "@heroicons/vue/20/solid";
import { Notification, useNotificationStore } from "../../stores/notification";

const props = defineProps<{ notification: Notification }>();

const notificationStore = useNotificationStore();

const onDelete = () => {
  notificationStore.removeNotification(props.notification.id);
};
</script>
