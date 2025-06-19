import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../lib/api-client";
import {
  AasConnectionGetAllDto,
  CreateAasConnectionDto,
} from "@open-dpp/api-client";

export const useAasConnectionStore = defineStore("aas-integration", () => {
  const aasConnections = ref<AasConnectionGetAllDto[]>([]);
  const fetchConnections = async () => {
    const response = await apiClient.aasIntegration.getAllConnections();
    aasConnections.value = response.data;
  };

  const createConnection = async (data: CreateAasConnectionDto) => {
    const response = await apiClient.aasIntegration.createConnection(data);
    return response.data;
  };

  return {
    aasConnections,
    fetchConnections,
    createConnection,
  };
});
