import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../lib/api-client";
import {
  DataFieldDraftCreateDto,
  DataFieldDraftUpdateDto,
  ProductDataModelDraftDto,
  SectionDraftCreateDto,
  SectionDraftUpdateDto,
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

  const deleteSection = async (sectionId: string) => {
    if (draft.value) {
      const response = await apiClient.productDataModelDrafts.deleteSection(
        draft.value.id,
        sectionId,
      );
      draft.value = response.data;
    }
  };

  const modifySection = async (
    sectionId: string,
    data: SectionDraftUpdateDto,
  ) => {
    if (draft.value) {
      const response = await apiClient.productDataModelDrafts.modifySection(
        draft.value.id,
        sectionId,
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

  const findSectionOfDataField = (dataFieldId: string) => {
    return draft.value?.sections.find((s) =>
      s.dataFields.some((d) => d.id === dataFieldId),
    );
  };

  const findDataField = (dataFieldId: string) => {
    if (draft.value) {
      for (const section of draft.value.sections) {
        const foundDataField = section.dataFields.find(
          (d) => d.id === dataFieldId,
        );
        if (foundDataField) {
          return foundDataField;
        }
      }
    }
    return undefined;
  };

  const deleteDataField = async (dataFieldId: string) => {
    const foundSection = findSectionOfDataField(dataFieldId);
    if (draft.value && foundSection) {
      const response = await apiClient.productDataModelDrafts.deleteDataField(
        draft.value.id,
        foundSection.id,
        dataFieldId,
      );
      draft.value = response.data;
    }
  };

  const modifyDataField = async (
    dataFieldId: string,
    data: DataFieldDraftUpdateDto,
  ) => {
    const foundSection = findSectionOfDataField(dataFieldId);
    if (draft.value && foundSection) {
      const response = await apiClient.productDataModelDrafts.modifyDataField(
        draft.value.id,
        foundSection.id,
        dataFieldId,
        data,
      );
      draft.value = response.data;
    }
  };

  return {
    draft,
    fetchDraft,
    addSection,
    modifySection,
    deleteSection,
    addDataField,
    modifyDataField,
    deleteDataField,
    findSectionOfDataField,
    findDataField,
  };
});
