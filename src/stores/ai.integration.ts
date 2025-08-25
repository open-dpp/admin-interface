import { defineStore } from "pinia";
import { AiConfigurationDto } from "@open-dpp/api-client";
import { ref } from "vue";
import { useErrorHandlingStore } from "./error.handling";
import apiClient from "../lib/api-client";

export const useAiIntegrationStore = defineStore("ai-integration", () => {
  const configuration = ref<AiConfigurationDto>();
  const errorHandlingStore = useErrorHandlingStore();
  const fetchConfiguration = async () => {
    try {
      const response = await apiClient.agentServer.aiConfigurations.get();
      configuration.value = response.data;
    } catch (error) {
      errorHandlingStore.logErrorWithNotification(
        "Laden der Konfiguration fehlgeschlagen:",
        error,
      );
    }
  };

  return { configuration, fetchConfiguration };
});
