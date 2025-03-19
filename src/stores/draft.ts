import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../lib/api-client";
import {
  DataFieldDraftCreateDto,
  ProductDataModelDraftDto,
  SectionDraftCreateDto,
} from "@open-dpp/api-client";

export const useDraftStore = defineStore("draft", () => {
  const draft = ref<ProductDataModelDraftDto>();

  const fetchDraft = async (id: string) => {
    const response = await apiClient.productDataModelDrafts.getById(id);
    draft.value = response.data;
  };

  const addSection = async (data: SectionDraftCreateDto) => {
    if (draft.value) {
      const response = await apiClient.productDataModelDrafts.addSection(
        draft.value.id,
        data,
      );
      draft.value = response.data;
    }
  };

  const addDataField = async (
    sectionId: string,
    data: DataFieldDraftCreateDto,
  ) => {
    if (draft.value) {
      const response = await apiClient.productDataModelDrafts.addDataField(
        draft.value.id,
        sectionId,
        data,
      );
      draft.value = response.data;
    }
  };

  return { draft, fetchDraft, addSection, addDataField };
});
