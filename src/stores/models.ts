import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../lib/api-client";
import { ModelDto } from "@open-dpp/api-client";

export const useModelsStore = defineStore("models", () => {
  const models = ref<ModelDto[]>([]);

  const getModels = async () => {
    const response = await apiClient.models.getModels();
    models.value = response.data;
  };

  const getModelById = async (id: string) => {
    const response = await apiClient.models.getModelById(id);
    return response.data;
  };

  return { models, getModels, getModelById };
});
