import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../lib/api-client";
import {
  DataFieldDraftCreateDto,
  DataFieldDraftUpdateDto,
  SectionDraftCreateDto,
  SectionDraftUpdateDto,
  TemplateDraftCreateDto,
  TemplateDraftDto,
  VisibilityLevel,
} from "@open-dpp/api-client";

export const useDraftStore = defineStore("draft", () => {
  const draft = ref<TemplateDraftDto>();

  const createDraft = async (data: TemplateDraftCreateDto) => {
    const response = await apiClient.dpp.templateDrafts.create(data);
    draft.value = response.data;
  };

  const fetchDraft = async (id: string) => {
    const response = await apiClient.dpp.templateDrafts.getById(id);
    draft.value = response.data;
  };

  const addSection = async (data: SectionDraftCreateDto) => {
    if (draft.value) {
      const response = await apiClient.dpp.templateDrafts.addSection(
        draft.value.id,
        data,
      );
      draft.value = response.data;
    }
  };

  const deleteSection = async (sectionId: string) => {
    if (draft.value) {
      const response = await apiClient.dpp.templateDrafts.deleteSection(
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
      const response = await apiClient.dpp.templateDrafts.modifySection(
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
      const response = await apiClient.dpp.templateDrafts.addDataField(
        draft.value.id,
        sectionId,
        data,
      );
      draft.value = response.data;
    }
  };

  const findSectionById = (sectionId: string) => {
    return draft.value?.sections.find((s) => s.id === sectionId);
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
      const response = await apiClient.dpp.templateDrafts.deleteDataField(
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
      const response = await apiClient.dpp.templateDrafts.modifyDataField(
        draft.value.id,
        foundSection.id,
        dataFieldId,
        data,
      );
      draft.value = response.data;
    }
  };

  const publish = async (data: { visibility: VisibilityLevel }) => {
    if (draft.value) {
      const response = await apiClient.dpp.templateDrafts.publish(
        draft.value.id,
        { ...data, sectors: draft.value.sectors },
      );
      draft.value = response.data;
    }
  };

  return {
    draft,
    createDraft,
    fetchDraft,
    addSection,
    modifySection,
    deleteSection,
    addDataField,
    modifyDataField,
    deleteDataField,
    findSectionById,
    findSectionOfDataField,
    findDataField,
    publish,
  };
});
