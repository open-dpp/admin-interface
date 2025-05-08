import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../lib/api-client";
import {
  DataFieldDraftCreateDto,
  DataFieldDraftUpdateDto,
  LayoutDto,
  ProductDataModelDraftCreateDto,
  ProductDataModelDraftDto,
  PublicationCreateDto,
  ResponsiveConfigDto,
  SectionDraftCreateDto,
  SectionDraftUpdateDto,
  SectionDto,
} from "@open-dpp/api-client";

export const useDraftStore = defineStore("draft", () => {
  const draft = ref<ProductDataModelDraftDto>();

  const createDraft = async (data: ProductDataModelDraftCreateDto) => {
    const response = await apiClient.productDataModelDrafts.create(data);
    draft.value = response.data;
  };

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

  const publish = async (data: PublicationCreateDto) => {
    if (draft.value) {
      const response = await apiClient.productDataModelDrafts.publish(
        draft.value.id,
        data,
      );
      draft.value = response.data;
    }
  };

  const findEmptySpacesInSectionLayout = (sectionDto: SectionDto) => {
    const layoutItems: LayoutDto[] = [
      ...sectionDto.dataFields.map((d) => d.layout),
      ...sectionDto.subSections
        .map((sid) => findSectionById(sid)?.layout)
        .filter((l) => l !== undefined),
    ];
    return findEmptyGridSpaces(layoutItems, sectionDto.layout.cols.sm);
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
    findEmptySpacesInSectionLayout,
  };
});

export function generateClasses(
  config: ResponsiveConfigDto,
  className: string,
) {
  const hasBreakpoints = Object.keys(config).length > 0;

  const effectiveBreakpoints = hasBreakpoints ? config : { xs: 1 }; // default if none are provided

  return Object.entries(effectiveBreakpoints).map(
    ([key, value]) => `${key}:${className}-${value}`,
  );
}

export function findEmptyGridSpaces(
  layoutItems: LayoutDto[],
  cols: number,
): LayoutDto[] {
  const emptyCells: LayoutDto[] = [];
  if (layoutItems.length === 0) {
    const totalRows = 1;
    // Return all cells as empty
    for (let r = 0; r < totalRows; r++) {
      for (let c = 0; c < cols; c++) {
        emptyCells.push({
          colStart: { sm: c + 1 },
          rowStart: { sm: r + 1 },
          colSpan: { sm: 1 },
          rowSpan: { sm: 1 },
        });
      }
    }
    return emptyCells;
  }

  // Step 1: Calculate number of rows if not provided
  let totalRows = 0;
  for (const item of layoutItems) {
    const rowStart = item.rowStart.sm;
    const rowSpan = item.rowSpan.sm;
    const endRow = rowStart + rowSpan;
    if (endRow > totalRows) totalRows = endRow;
  }

  // Step 2: Initialize grid
  const grid: boolean[][] = Array.from({ length: totalRows }, () =>
    Array(cols).fill(false),
  );

  // Step 3: Mark occupied cells
  for (const item of layoutItems) {
    const colStart = item.colStart.sm - 1;
    const colSpan = item.colSpan.sm;
    const rowStart = item.rowStart.sm - 1;
    const rowSpan = item.rowSpan.sm;

    for (let r = rowStart; r < rowStart + rowSpan; r++) {
      for (let c = colStart; c < colStart + colSpan; c++) {
        if (r >= 0 && r < totalRows && c >= 0 && c < cols) {
          grid[r][c] = true;
        }
      }
    }
  }

  // Step 4: Collect empty cells
  for (let r = 0; r < totalRows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!grid[r][c]) {
        emptyCells.push({
          colStart: { sm: c + 1 },
          rowStart: { sm: r + 1 },
          colSpan: { sm: 1 },
          rowSpan: { sm: 1 },
        });
      }
    }
  }

  return emptyCells;
}
