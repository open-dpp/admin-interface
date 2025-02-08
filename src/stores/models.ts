import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../lib/api-client.ts";
import { ModelDto } from "@open-dpp/api-client/dist/model.dto";
import { ModelCreateDto } from "@open-dpp/api-client/dist/model.create.dto";

export const useModelsStore = defineStore("models", () => {
  const models = ref<ModelDto[]>([]);

  const getModels = async () => {
    const response = await apiClient.getModels();
    models.value = response.data;
  };

  const getModelById = async (id: string) => {
    const response = await apiClient.getModelById(id);
    return response.data;
  };

  const createModel = async (data: ModelCreateDto) => {
    const response = await apiClient.postModel(data);
    return response.data;
  };

  return { models, getModels, getModelById, createModel };
});
