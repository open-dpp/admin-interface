import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../lib/api-client";
import { AasConnectionGetAllDto } from "@open-dpp/api-client";

export const useAasIntegrationStore = defineStore("aas-integration", () => {
  const aasConnections = ref<AasConnectionGetAllDto[]>([]);
  const fetchConnections = async () => {
    const response = await apiClient.aasIntegration.getAllConnections();
    aasConnections.value = response.data;
  };

  return {
    aasConnections,
    fetchConnections,
  };
});
