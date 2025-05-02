import { defineStore } from "pinia";
import { ref } from "vue";
import {
  DataValueCreateDto,
  DataValueDto,
  DataValuePatchDto,
  isDataFieldRef,
  isSectionGrid,
  ModelDto,
  NodeDto,
  ProductDataModelDto,
  SectionDto,
  SectionGridDto,
  SectionType,
} from "@open-dpp/api-client";
import apiClient from "../lib/api-client";
import { assign, keys, maxBy, minBy, pick } from "lodash";
import { generateClassesForNode } from "../lib/view";

type FormKitSchemaNode =
  | string // Text content
  | number // Number content
  | boolean // Boolean content
  | null
  | FormKitSchemaObject // Actual schema object
  | FormKitSchemaNode[]; // Array of nodes (for children or conditional rendering)

interface FormKitSchemaObject {
  $el?: string; // HTML tag or FormKit component (e.g., 'div', 'FormKit')
  $cmp?: string; // Custom Vue component (alternative to $el)
  props?: Record<string, unknown>; // Props passed to the element/component
  attrs?: Record<string, unknown>;
  children?: FormKitSchemaNode; // Child nodes (can be a node, string, or array)
}

export const useModelFormStore = defineStore("model.form", () => {
  const model = ref<ModelDto>();
  const productDataModel = ref<ProductDataModelDto>();
  const fetchInFlight = ref<boolean>(false);

  const getDataOfSection = (sectionId: string): DataValueDto[] => {
    const section = productDataModel.value?.data.sections.find(
      (s) => s.id === sectionId,
    );
    if (!section) {
      return [];
    }
    const dataValues: DataValueDto[] = [];
    for (const subSection of section.subSections) {
      dataValues.push(...getDataOfSection(subSection));
    }
    if (model.value) {
      dataValues.push(
        ...model.value.dataValues.filter((d) => d.dataSectionId === sectionId),
      );
    }
    return dataValues;
  };

  const getFormData = (
    sectionId: string,
    existingFormData: Record<string, unknown>,
  ) => {
    const dataValues = Object.fromEntries(
      getDataOfSection(sectionId)?.map((d) => [d.id, d.value]) ?? [],
    );
    return assign({}, dataValues, pick(existingFormData, keys(dataValues)));
  };

  const findNodeById = (nodeId: string): NodeDto | undefined => {
    return productDataModel.value?.view.nodes.find((n) => n.id === nodeId);
  };

  const findSectionById = (sectionId: string) => {
    return productDataModel.value?.data.sections.find(
      (s) => s.id === sectionId,
    );
  };

  const getFormSchemaRepeatable = (
    sectionGrid: SectionGridDto,
    section: SectionDto,
  ): FormKitSchemaObject[] => {
    const dataValuesOfSectionAllRows = getDataOfSection(section.id);
    const minRow = minBy(dataValuesOfSectionAllRows, "row")?.row ?? 0;
    const maxRow =
      section.type !== SectionType.REPEATABLE
        ? 0
        : (maxBy(dataValuesOfSectionAllRows, "row")?.row ?? 0);

    const rows = [];
    for (let rowIndex = minRow; rowIndex <= maxRow; rowIndex++) {
      rows.push(...getFormSchema(sectionGrid, section, rowIndex));
    }
    return rows;
  };

  const getFormSchema = (
    sectionGrid: SectionGridDto,
    section: SectionDto,
    row?: number,
  ): FormKitSchemaObject[] => {
    if (section.type === SectionType.REPEATABLE && row === undefined) {
      return getFormSchemaRepeatable(sectionGrid, section);
    }
    const dataValuesOfSection = getDataOfSection(section.id).filter(
      (d) => d.row === row,
    );

    const children = [];
    for (const gridItemId of sectionGrid.children) {
      const gridItem = findNodeById(gridItemId);
      if (gridItem) {
        if (isSectionGrid(gridItem)) {
          const subSection = findSectionById(gridItem.sectionId);
          if (subSection) {
            children.push(...getFormSchema(gridItem, subSection, row));
          }
        }
        if (isDataFieldRef(gridItem)) {
          const dataField = section.dataFields.find(
            (d) => d.id === gridItem.fieldId,
          );
          const dataValueId = dataValuesOfSection.find(
            (d) => d.dataFieldId === dataField?.id,
          )?.id;

          if (dataField && dataValueId) {
            children.push({
              $cmp: dataField.type,
              props: {
                id: dataValueId,
                name: dataValueId,
                label: dataField!.name,
                validation: "required",
                className: generateClassesForNode(gridItem),
              },
            });
          }
        }
      }
    }
    return [
      {
        $el: "div",
        attrs: {
          class: `grid ${generateClassesForNode(sectionGrid)}`,
        },
        children: children,
      },
    ];
  };

  const generateDataValues = (sectionId: string): DataValueCreateDto[] => {
    const dataValuesOfSection = getDataOfSection(sectionId);

    const maxRow = maxBy(dataValuesOfSection, "row")?.row;
    const section = productDataModel.value?.data.sections.find(
      (s) => s.id === sectionId,
    );
    const dataValuesToCreate = [];
    if (!section) {
      return [];
    }
    for (const subSectionId of section.subSections) {
      dataValuesToCreate.push(...generateDataValues(subSectionId));
    }
    dataValuesToCreate.push(
      ...section.dataFields.map((f) => ({
        value: undefined,
        dataSectionId: section?.id,
        dataFieldId: f.id,
        row: maxRow === undefined ? 0 : maxRow + 1,
      })),
    );
    return dataValuesToCreate;
  };

  const addRowToSection = async (sectionId: string) => {
    if (model.value) {
      const dataValuesToCreate = generateDataValues(sectionId);
      const response = await apiClient.models.addModelData(
        model.value.id,
        dataValuesToCreate,
      );
      model.value = response.data;
    }
  };

  const fetchModel = async (id: string) => {
    fetchInFlight.value = true;
    const response = await apiClient.models.getModelById(id);

    model.value = response.data;
    if (model.value.productDataModelId) {
      const response =
        await apiClient.productDataModels.getProductDataModelById(
          model.value.productDataModelId,
        );
      productDataModel.value = response.data;
    }
    fetchInFlight.value = false;
  };

  const updateModelData = async (dataValues: DataValuePatchDto[]) => {
    if (model.value) {
      const response = await apiClient.models.updateModelData(
        model.value.id,
        dataValues,
      );
      model.value = response.data;
    }
  };

  return {
    model,
    productDataModel,
    fetchInFlight,
    fetchModel,
    findSectionById,
    updateModelData,
    addRowToSection,
    getFormData,
    getFormSchema,
  };
});
