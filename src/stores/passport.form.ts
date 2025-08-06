import { defineStore } from "pinia";
import { ref } from "vue";
import {
  DataValueDto,
  GranularityLevel,
  ProductPassportDataDto,
  SectionDto,
  TemplateDto,
  UniqueProductIdentifierDto,
} from "@open-dpp/api-client";
import apiClient from "../lib/api-client";
import { assign, keys, maxBy, minBy, pick } from "lodash";

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

export const usePassportFormStore = defineStore("passport.form", () => {
  const granularityLevel = ref<GranularityLevel>(GranularityLevel.MODEL);
  const modelId = ref<string>();
  const passport = ref<ProductPassportDataDto & { name: string }>();
  const template = ref<TemplateDto>();
  const fetchInFlight = ref<boolean>(false);

  const VALUE_FOR_OTHER_GRANULARITY_LEVEL = {
    [GranularityLevel.MODEL]: "Wird auf Artikelebene gesetzt",
    [GranularityLevel.ITEM]: "Wird auf Modelebene gesetzt",
  };

  const getValueForOtherGranularityLevel = () => {
    return VALUE_FOR_OTHER_GRANULARITY_LEVEL[granularityLevel.value];
  };

  const getDataOfSection = (sectionId: string): DataValueDto[] => {
    const section = template.value?.sections.find((s) => s.id === sectionId);
    if (!section) {
      return [];
    }
    const dataValues: DataValueDto[] = [];
    for (const subSection of section.subSections) {
      dataValues.push(...getDataOfSection(subSection));
    }
    if (passport.value) {
      dataValues.push(
        ...passport.value.dataValues.filter(
          (d) => d.dataSectionId === sectionId,
        ),
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
    return template.value?.sections.find((s) => s.id === sectionId);
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
      if (dataField.granularityLevel !== granularityLevel.value) {
        children.push({
          $cmp: "FakeField",
          props: {
            dataCy: dataValueId(section.id, dataField.id, row),
            placeholder: getValueForOtherGranularityLevel(),
            label: dataField!.name,
            options: dataField.options,
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
            options: dataField.options,
          },
        });
      }
    }

    return [
      {
        $el: "div",
        attrs: {
          class: `grid gap-1 items-center`,
        },
        children: children,
      },
    ];
  };

  const generateDataValues = (sectionId: string): DataValueDto[] => {
    const dataValuesOfSection = getDataOfSection(sectionId);

    const maxRow = maxBy(dataValuesOfSection, "row")?.row;
    const section = template.value?.sections.find((s) => s.id === sectionId);
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
    if (modelId.value && passport.value) {
      const dataValuesToCreate = generateDataValues(sectionId);
      const response =
        granularityLevel.value === GranularityLevel.MODEL
          ? await apiClient.dpp.models.addData(
              passport.value.id,
              dataValuesToCreate,
            )
          : await apiClient.dpp.items.addData(
              modelId.value,
              passport.value.id,
              dataValuesToCreate,
            );
      passport.value = { ...response.data, name: passport.value.name };
    }
  };

  const fetchProductDataModel = async () => {
    if (passport.value?.templateId) {
      const response = await apiClient.dpp.templates.getById(
        passport.value.templateId,
      );
      template.value = response.data;
    }
  };

  const fetchModel = async (id: string) => {
    fetchInFlight.value = true;
    const response = await apiClient.dpp.models.getById(id);
    granularityLevel.value = GranularityLevel.MODEL;
    passport.value = response.data;
    modelId.value = id;
    await fetchProductDataModel();
    fetchInFlight.value = false;
  };

  const _getUUID = (uniqueProductIdentifiers: UniqueProductIdentifierDto[]) => {
    return uniqueProductIdentifiers.length > 0
      ? uniqueProductIdentifiers[0].uuid
      : "Referenz nicht gesetzt";
  };

  const getUUID = () => {
    return _getUUID(passport.value?.uniqueProductIdentifiers ?? []);
  };

  const fetchItem = async (modelIdToFetch: string, id: string) => {
    fetchInFlight.value = true;
    const response = await apiClient.dpp.items.getById(modelIdToFetch, id);
    granularityLevel.value = GranularityLevel.ITEM;
    passport.value = {
      ...response.data,
      name: `Artikel mit ID ${_getUUID(response.data.uniqueProductIdentifiers)}`,
    };

    modelId.value = modelIdToFetch;
    await fetchProductDataModel();
    fetchInFlight.value = false;
  };

  const updateDataValues = async (
    dataValues: { id: string; value: unknown }[],
  ) => {
    if (modelId.value && passport.value) {
      const dataValueModifications = dataValues.map((d) =>
        dataValueIdToDataValue(d.id, d.value),
      );
      const response =
        granularityLevel.value === GranularityLevel.MODEL
          ? await apiClient.dpp.models.modifyData(
              passport.value.id,
              dataValueModifications,
            )
          : await apiClient.dpp.items.modifyData(
              modelId.value,
              passport.value.id,
              dataValueModifications,
            );
      passport.value = {
        ...response.data,
        name: passport.value.name,
      };
    }
  };

  return {
    getUUID,
    granularityLevel,
    passport,
    template,
    fetchInFlight,
    getValueForOtherGranularityLevel,
    fetchModel,
    fetchItem,
    findSectionById,
    updateDataValues,
    addRowToSection,
    getFormData,
    getFormSchema,
    getFormSchemaRepeatable,
  };
});
