import { defineStore } from "pinia";
import { ref } from "vue";
import {
  DataValueDto,
  GranularityLevel,
  ModelDto,
  ProductDataModelDto,
  SectionDto,
} from "@open-dpp/api-client";
import apiClient from "../lib/api-client";
import { assign, keys, maxBy, minBy, pick } from "lodash";
import { generateClassesForLayout } from "../lib/layout";

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

function dataValueId(sectionId: string, dataFieldId: string, row: number) {
  return [sectionId, dataFieldId, row].join(".");
}
function dataValueIdFromDataValue(dataValue: DataValueDto) {
  return dataValueId(
    dataValue.dataSectionId,
    dataValue.dataFieldId,
    dataValue.row,
  );
}

const VALUE_FOR_ITEM_LEVEL = "Wird auf Artikelebene gesetzt";

function dataValueIdToDataValue(
  dataValueId: string,
  value: unknown,
): DataValueDto {
  const [dataSectionId, dataFieldId, row] = dataValueId.split(".");
  return {
    value,
    dataSectionId,
    dataFieldId,
    row: parseInt(row),
  };
}

export const useModelFormStore = defineStore("model.form", () => {
  const model = ref<ModelDto>();
  const productDataModel = ref<ProductDataModelDto>();
  const fetchInFlight = ref<boolean>(false);

  const getDataOfSection = (sectionId: string): DataValueDto[] => {
    const section = productDataModel.value?.sections.find(
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
      getDataOfSection(sectionId)?.map((d) => [
        dataValueIdFromDataValue(d),
        d.value,
      ]) ?? [],
    );
    return assign({}, dataValues, pick(existingFormData, keys(dataValues)));
  };

  const findSectionById = (sectionId: string) => {
    return productDataModel.value?.sections.find((s) => s.id === sectionId);
  };

  const getFormSchemaRepeatable = (
    section: SectionDto,
  ): FormKitSchemaObject[] => {
    const dataValuesOfSectionAllRows = getDataOfSection(section.id);
    const minRow = minBy(dataValuesOfSectionAllRows, "row")?.row ?? 0;
    const maxRow = maxBy(dataValuesOfSectionAllRows, "row")?.row ?? 0;

    const rows = [];
    for (let rowIndex = minRow; rowIndex <= maxRow; rowIndex++) {
      rows.push(...getFormSchema(section, rowIndex));
      if (rowIndex < maxRow) {
        rows.push({
          $el: "div",
          attrs: {
            class: `w-full border-t border-gray-300 m-2`,
          },
        });
      }
    }
    return rows;
  };

  const getFormSchema = (
    section: SectionDto,
    row: number = 0,
  ): FormKitSchemaObject[] => {
    const dataValuesOfSection = getDataOfSection(section.id).filter(
      (d) => d.row === row,
    );

    const children = [];

    for (const subSectionId of section.subSections) {
      const subSection = findSectionById(subSectionId);
      if (subSection) {
        children.push(...getFormSchema(subSection, row));
      }
    }
    for (const dataField of section.dataFields) {
      if (dataField.granularityLevel === GranularityLevel.ITEM) {
        children.push({
          $cmp: dataField.type,
          props: {
            id: dataValueId(section.id, dataField.id, row),
            readonly: true,
            disabled: true,
            label: dataField!.name,
            value: VALUE_FOR_ITEM_LEVEL,
            className: generateClassesForLayout(dataField.layout),
          },
        });
      }

      const dataValue = dataValuesOfSection.find(
        (d) => d.dataFieldId === dataField.id,
      );

      if (dataValue) {
        children.push({
          $cmp: dataField.type,
          props: {
            id: dataValueIdFromDataValue(dataValue),
            name: dataValueIdFromDataValue(dataValue),
            label: dataField!.name,
            validation: "required",
            className: generateClassesForLayout(dataField.layout),
          },
        });
      }
    }

    return [
      {
        $el: "div",
        attrs: {
          class: `grid gap-1 items-center ${generateClassesForLayout(section.layout)}`,
        },
        children: children,
      },
    ];
  };

  const generateDataValues = (sectionId: string): DataValueDto[] => {
    const dataValuesOfSection = getDataOfSection(sectionId);

    const maxRow = maxBy(dataValuesOfSection, "row")?.row;
    const section = productDataModel.value?.sections.find(
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

  const updateModelData = async (
    dataValues: { id: string; value: unknown }[],
  ) => {
    if (model.value) {
      const filteredDataValues = dataValues.filter(
        (d) => d.value !== VALUE_FOR_ITEM_LEVEL,
      );
      const response = await apiClient.models.updateModelData(
        model.value.id,

        filteredDataValues.map((d) => dataValueIdToDataValue(d.id, d.value)),
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
    getFormSchemaRepeatable,
  };
});
