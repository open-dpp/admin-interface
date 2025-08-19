<template>
  <div
    class="flex flex-row gap-4 p-2 mb-4 w-full shadow-xs ring-1 ring-inset ring-gray-300 rounded-md border-0"
  >
    <FormKit
      v-model="uploadedMediaId"
      :data-cy="id"
      :name="id"
      inner-class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300"
      type="hidden"
      v-bind="computedAttrs"
    />
    <input
      v-show="false"
      ref="fileInput"
      :placeholder="label"
      class="cursor-pointer select-none py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
      readonly
      type="file"
      @change="selectFile"
      @mousedown.prevent="emits('clicked')"
    />
    <div v-if="selectedFile" class="flex flex-row gap-4">
      <img
        v-if="isImage && fileUrl"
        :alt="label"
        :src="fileUrl"
        class="max-w-24 max-h-24"
      />
      <DocumentIcon v-else class="w-24 h-24 text-gray-600" />
      <div class="text-gray-600 my-auto">
        {{ selectedFile.name
        }}<span v-if="selectedFile && selectedFile.size">
          ({{ selectedFileSizeKB }} KB)</span
        >
      </div>
      <button
        class="bg-[#6BAD87] rounded-sm p-2 hover:cursor-pointer h-12 my-auto"
        @click="openFileInput"
      >
        Datei ändern
      </button>
      <button
        class="bg-[#6BAD87] rounded-sm p-2 hover:cursor-pointer h-12 my-auto"
        @click="uploadFile"
      >
        Datei hochladen
      </button>
    </div>
    <div v-else-if="uploadedMediaId" class="flex flex-row gap-4">
      <img
        v-if="uploadedFileUrl && uploadedFileContentType?.startsWith('image/')"
        :alt="label"
        :src="uploadedFileUrl"
        class="max-w-24 max-h-24"
      />
      <DocumentIcon v-else class="w-24 h-24 text-gray-600" />
      <div class="text-gray-600 text-sm my-auto">
        {{ uploadedMediaId }}
      </div>
      <a
        :download="uploadedMediaId"
        :href="uploadedFileUrl"
        class="bg-[#6BAD87] rounded-sm p-2 hover:cursor-pointer my-auto"
      >
        Herunterladen
      </a>
      <button
        class="bg-[#6BAD87] rounded-sm p-2 hover:cursor-pointer my-auto"
        @click="openFileInput"
      >
        Datei ändern
      </button>
    </div>
    <div v-else class="flex flex-row gap-4">
      <div class="text-gray-600 my-auto">Keine Datei ausgewählt</div>
      <button
        class="bg-[#6BAD87] rounded-sm p-2 hover:cursor-pointer h-12 my-auto"
        @click="openFileInput"
      >
        Datei auswählen
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref, useAttrs } from "vue";
import { usePassportFormStore } from "../../../stores/passport.form";
import { useIndexStore } from "../../../stores";
import { useNotificationStore } from "../../../stores/notification";
import { useMediaStore } from "../../../stores/media";
import { DocumentIcon } from "@heroicons/vue/24/outline";

const passportFormStore = usePassportFormStore();
const indexStore = useIndexStore();
const notificationStore = useNotificationStore();
const mediaStore = useMediaStore();

const props = defineProps<{ id: string; label: string }>();

const emits = defineEmits<{
  (e: "clicked"): void;
}>();

const attrs = useAttrs() as Record<string, unknown>;

const fileInput = ref<HTMLInputElement>();
const selectedFile = ref<File | null>(null);
const uploadProgress = ref<number>(0);
const uploadedMediaId = ref<string | undefined>(undefined);
const uploadedFileUrl = ref<string | undefined>(undefined);
const uploadedFileContentType = ref<string | undefined>(undefined);

const computedAttrs = computed(() => ({
  ...attrs,
}));

const isImage = computed(() => {
  if (!selectedFile.value) {
    return false;
  }
  return selectedFile.value.type.startsWith("image/");
});

const fileUrl = computed(() => {
  if (!selectedFile.value) {
    return null;
  }
  return URL.createObjectURL(selectedFile.value);
});

const selectedFileSizeKB = computed(() => {
  const size = selectedFile.value?.size;
  if (typeof size !== "number") {
    return null;
  }
  return (size / 1024).toFixed(1);
});

const openFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const selectFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
  } else {
    selectedFile.value = null;
  }
};

const uploadFile = async () => {
  if (!selectedFile.value) {
    return;
  }
  try {
    uploadedMediaId.value = await mediaStore.uploadDppMedia(
      indexStore.selectedOrganization,
      passportFormStore.getUUID(),
      props.id,
      selectedFile.value,
      (progress) => (uploadProgress.value = progress),
    );
    notificationStore.addSuccessNotification("Datei erfolgreich hochgeladen.");
    await loadFile();
  } catch (error: unknown) {
    console.error("Fehler beim Hochladen der Datei:", error);
    uploadedMediaId.value = undefined;
    notificationStore.addErrorNotification(
      "Beim Hochladen der Datei ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut.",
    );
    selectedFile.value = null;
  } finally {
    uploadProgress.value = 0;
  }
};

const loadFile = async () => {
  if (!uploadedMediaId.value) {
    return;
  }

  try {
    const { blob, contentType } = await mediaStore.fetchDppMedia(
      passportFormStore.getUUID(),
      props.id,
    );

    // Revoke an old object URL to avoid memory leaks before assigning a new one
    if (uploadedFileUrl.value) {
      try {
        URL.revokeObjectURL(uploadedFileUrl.value);
      } catch (revokeErr) {
        console.error(
          "Fehler beim Freigeben der vorherigen Objekt-URL:",
          revokeErr,
        );
      }
    }

    uploadedFileUrl.value = URL.createObjectURL(blob);
    uploadedFileContentType.value = contentType;
  } catch (error) {
    console.error("Fehler beim Laden der Datei:", error);
    // Reset state on failure
    if (uploadedFileUrl.value) {
      try {
        URL.revokeObjectURL(uploadedFileUrl.value);
      } catch (revokeErr) {
        console.error(
          "Fehler beim Freigeben der Objekt-URL nach Fehler:",
          revokeErr,
        );
      }
    }
    uploadedFileUrl.value = undefined;
    uploadedFileContentType.value = undefined;

    // Notify user via the existing notification store if available
    try {
      notificationStore.addErrorNotification(
        "Die Datei konnte nicht geladen werden. Bitte versuchen Sie es erneut.",
      );
    } catch {
      // Fallback to console if the notification store is not available for any reason
      console.error(
        "Benachrichtigung über Ladefehler konnte nicht angezeigt werden.",
      );
    }
    // We intentionally do not rethrow to keep caller logic simple unless needed.
  }
};

onMounted(async () => {
  await loadFile();
});
</script>
