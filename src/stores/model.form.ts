import { defineStore } from "pinia";
import { ref } from "vue";
import {
  DataValuePatchDto,
  ModelDto,
  ProductDataModelDto,
  SectionType,
} from "@open-dpp/api-client";
import apiClient from "../lib/api-client";
import { groupBy, maxBy, minBy } from "lodash";

export const useModelFormStore = defineStore("model.form", () => {
  const model = ref<ModelDto>();
  const productDataModel = ref<ProductDataModelDto>();

  const getDataOfSection = (sectionId: string) => {
    return model.value?.dataValues.filter((d) => d.dataSectionId === sectionId);
  };

  const getFormData = (sectionId: string) => {
    return Object.fromEntries(
      getDataOfSection(sectionId)?.map((d) => [d.id, d.value]) ?? [],
    );
  };

  const getFormSchema = (sectionId: string) => {
    const section = productDataModel.value?.sections.find(
      (s) => s.id === sectionId,
    );
    const dataValuesOfSection = getDataOfSection(sectionId);
    if (section?.type === SectionType.GROUP) {
      return section.dataFields
        .map((f) => {
          const dataValueId = dataValuesOfSection?.find(
            (d) => d.dataFieldId === f.id,
          )?.id;
          return {
            $cmp: f.type,
            props: {
              id: dataValueId,
              name: dataValueId,
              label: f.name,
              validation: "required",
            },
          };
        })
        .flat();
    }

    const dataValuesByRow = groupBy(dataValuesOfSection, "row");

    if (dataValuesOfSection?.length === 0) {
      return [];
    }
    const minRow = minBy(dataValuesOfSection, "row")?.row ?? 0;
    const maxRow = maxBy(dataValuesOfSection, "row")?.row ?? 0;
    const rows = [];

    for (let i = minRow; i <= maxRow; i++) {
      if (section) {
        const row = section.dataFields.map((dataField) => {
          const dataValue = dataValuesByRow[i].find(
            (v) => v.dataFieldId === dataField.id,
          );
          return {
            type: dataField.type,
            id: dataValue?.id,
            name: dataValue?.id,
            label: dataField.name,
            validation: "required",
          };
        });
        rows.push(...row);
      }
    }

    return rows.map((r) => ({
      $cmp: r.type,
      props: {
        id: r.id,
        name: r.name,
        label: r.label,
        validation: "required",
      },
    }));
  };

  const addRowToSection = async (sectionId: string) => {
    if (model.value) {
      const dataValuesOfSection = getDataOfSection(sectionId);

      const maxRow = maxBy(dataValuesOfSection, "row")?.row;
      const section = productDataModel.value?.sections.find(
        (s) => s.id === sectionId,
      );
      const dataValuesToCreate =
        section?.dataFields.map((f) => ({
          value: undefined,
          dataSectionId: section?.id,
          dataFieldId: f.id,
          row: maxRow === undefined ? 0 : maxRow + 1,
        })) ?? [];
      const response = await apiClient.models.addModelData(
        model.value.id,
        dataValuesToCreate,
      );
      model.value = response.data;
    }
  };

  const fetchModel = async (id: string) => {
    const response = await apiClient.models.getModelById(id);
    model.value = response.data;
    if (model.value.productDataModelId) {
      const response =
        await apiClient.productDataModels.getProductDataModelById(
          model.value.productDataModelId,
        );
      productDataModel.value = response.data;
    }
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
    fetchModel,
    updateModelData,
    addRowToSection,
    getFormData,
    getFormSchema,
  };
});
