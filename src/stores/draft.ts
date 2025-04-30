import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../lib/api-client";
import {
  DataFieldDraftCreateDto,
  DataFieldDraftUpdateDto,
  isSectionGrid,
  NodeDto,
  ProductDataModelDraftCreateDto,
  ProductDataModelDraftDto,
  PublicationCreateDto,
  ResponsiveConfigDto,
  SectionDraftCreateDto,
  SectionDraftUpdateDto,
  SectionGridDto,
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
        draft.value.data.id,
        data,
      );
      draft.value = response.data;
    }
  };

  const deleteSection = async (sectionId: string) => {
    if (draft.value) {
      const response = await apiClient.productDataModelDrafts.deleteSection(
        draft.value.data.id,
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
        draft.value.data.id,
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
        draft.value.data.id,
        sectionId,
        data,
      );
      draft.value = response.data;
    }
  };

  const findSectionById = (sectionId: string) => {
    return draft.value?.data.sections.find((s) => s.id === sectionId);
  };

  const findSectionOfDataField = (dataFieldId: string) => {
    return draft.value?.data.sections.find((s) =>
      s.dataFields.some((d) => d.id === dataFieldId),
    );
  };

  const findDataField = (dataFieldId: string) => {
    if (draft.value) {
      for (const section of draft.value.data.sections) {
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
        draft.value.data.id,
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
        draft.value.data.id,
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
        draft.value.data.id,
        data,
      );
      draft.value = response.data;
    }
  };

  const generateClasses = (config: ResponsiveConfigDto, className: string) => {
    const hasBreakpoints = Object.keys(config).length > 0;

    const effectiveBreakpoints = hasBreakpoints ? config : { xs: 1 }; // default if none are provided

    return Object.entries(effectiveBreakpoints).map(
      ([key, value]) => `${key}:${className}-${value}`,
    );
  };

  const findNodeById = (nodeId: string): NodeDto | undefined => {
    return draft.value?.view.nodes.find((n) => n.id === nodeId);
  };

  const generateClassesForNode = (nodeId: string): string => {
    const found = findNodeById(nodeId);
    if (found) {
      const classes = generateClasses(found.colSpan, "col-span");
      if (found.colStart) {
        classes.push(...generateClasses(found.colStart, "col-start"));
      }
      if (found.rowSpan) {
        classes.push(...generateClasses(found.rowSpan, "row-span"));
      }
      if (found.rowStart) {
        classes.push(...generateClasses(found.rowStart, "row-start"));
      }
      if (isSectionGrid(found)) {
        classes.push(...generateClasses(found.cols, "grid-cols"));
      }
      return classes.join(" ");
    }
    return "";
  };

  const findEmptySpacesInSectionGrid = (sectionGrid: SectionGridDto) => {
    const gridItems = sectionGrid.children
      .map((gridItemId) => findNodeById(gridItemId))
      .filter((n) => n !== undefined);
    return findEmptyGridSpaces(
      gridItems,
      sectionGrid.cols!.sm!,
      "sm",
      gridItems.length === 0 ? 1 : undefined,
    );
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
    generateClassesForNode,
    findNodeById,
    findEmptySpacesInSectionGrid,
  };
});

type EmptyCellResponsive = {
  colStart: ResponsiveConfigDto;
  colSpan: ResponsiveConfigDto;
  rowStart: ResponsiveConfigDto;
};

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
  gridItems: NodeDto[],
  cols: number,
  breakpoint: "sm" | "md",
  totalRows?: number,
): EmptyCellResponsive[] {
  const emptyCells: EmptyCellResponsive[] = [];
  if (gridItems.length === 0) {
    if (!totalRows) {
      // No data to infer total rows
      console.warn(
        "Cannot compute empty grid without totalRows when gridItems is empty.",
      );
      return [];
    }

    // Return all cells as empty
    for (let r = 0; r < totalRows; r++) {
      for (let c = 0; c < cols; c++) {
        emptyCells.push({
          colStart: { [breakpoint]: c + 1 },
          rowStart: { [breakpoint]: r + 1 },
          colSpan: { [breakpoint]: 1 },
        });
      }
    }
    return emptyCells;
  }

  // Step 1: Calculate number of rows if not provided
  if (!totalRows) {
    totalRows = 0;
    for (const item of gridItems) {
      const rowStart = item.rowStart?.[breakpoint] ?? 1;
      const rowSpan = item.rowSpan?.[breakpoint] ?? 1;
      const endRow = rowStart + rowSpan - 1;
      if (endRow > totalRows) totalRows = endRow;
    }
  }

  // Step 2: Initialize grid
  const grid: boolean[][] = Array.from({ length: totalRows }, () =>
    Array(cols).fill(false),
  );

  // Step 3: Mark occupied cells
  for (const item of gridItems) {
    const colStart = (item.colStart?.[breakpoint] ?? 1) - 1;
    const colSpan = item.colSpan?.[breakpoint] ?? 1;
    const rowStart = (item.rowStart?.[breakpoint] ?? 1) - 1;
    const rowSpan = item.rowSpan?.[breakpoint] ?? 1;

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
          colStart: { [breakpoint]: c + 1 },
          rowStart: { [breakpoint]: r + 1 },
          colSpan: { [breakpoint]: 1 },
        });
      }
    }
  }

  return emptyCells;
}
