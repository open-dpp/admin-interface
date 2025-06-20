import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../lib/api-client";
import { groupBy } from "lodash";
import {
  AasConnectionDto,
  AasPropertyDto,
  GranularityLevel,
  SectionType,
} from "@open-dpp/api-client";

function aasDropdownValue(parentIdShort: string, idShort: string) {
  return [parentIdShort, idShort].join("/");
}

function aasDropdownValueToAasId(dropdownValue: string) {
  const [parentIdShort, idShort] = dropdownValue.split("/");
  return {
    parentIdShort,
    idShort,
  };
}

function dataFieldDropdownValue(sectionId: string, fieldId: string) {
  return [sectionId, fieldId].join("/");
}

function dataFieldDropdownValueToDppId(dropdownValue: string) {
  const [sectionId, dataFieldId] = dropdownValue.split("/");
  return {
    sectionId,
    dataFieldId,
  };
}

function aasFieldId(index: number) {
  return `aas-${index}`;
}

function dppFieldId(index: number) {
  return `dpp-${index}`;
}

export const useAasConnectionFormStore = defineStore(
  "aas-connection-form",
  () => {
    const formData = ref<Record<string, string>>({});
    const formSchema = ref();

    const granularityLevel = GranularityLevel.ITEM;
    const fetchInFlight = ref<boolean>(false);
    const lastRowIndex = ref<number>(0);

    const aasConnection = ref<AasConnectionDto>();
    const aasProperties = ref<
      {
        group: string;
        options: {
          label: string;
          value: string;
          property: AasPropertyDto;
        }[];
      }[]
    >([]);

    const productDataModelOptions = ref<
      {
        group: string;
        options: {
          label: string;
          value: string;
        }[];
      }[]
    >([]);

    const horizontalLine = () => {
      return {
        $el: "div",
        attrs: {
          class: "w-full border-t border-gray-300 m-2",
        },
      };
    };

    const newFieldAssignmentRow = (index: number) => {
      return {
        $el: "div",
        attrs: {
          class: "flex flex-col md:flex-row justify-around gap-2 items-center",
        },
        children: [
          {
            $el: "div",
            attrs: {
              class: "flex",
            },
            children: [
              {
                $formkit: "select",
                label: `Feld aus der Asset Administration Shell`,
                name: aasFieldId(index),
                placeholder:
                  "Wählen Sie ein Feld aus der Asset Administration Shell",
                options: aasProperties.value,
                "data-cy": `aas-select-${index}`,
              },
            ],
          },
          {
            $el: "div",
            children: "ist verknüpft mit",
            attrs: {
              class: "flex",
            },
          },
          {
            $el: "div",
            attrs: {
              class: "flex",
            },
            children: [
              {
                $formkit: "select",
                label: `Feld aus dem Produktdatenmodell`,
                placeholder: "Wählen Sie ein Feld aus dem Produktdatenmodell", // Add this line
                name: dppFieldId(index),
                options: productDataModelOptions.value,
                "data-cy": `dpp-select-${index}`,
              },
            ],
          },
        ],
      };
    };

    const initializeFormSchema = () => {
      if (aasConnection.value) {
        formSchema.value = [];
        for (const [index] of aasConnection.value.fieldAssignments.entries()) {
          lastRowIndex.value = index;
          formSchema.value.push(newFieldAssignmentRow(index));
          if (index !== aasConnection.value.fieldAssignments.length - 1) {
            formSchema.value.push(horizontalLine());
          }
        }
      }
    };

    const initializeFormData = () => {
      if (!aasConnection.value) {
        return {};
      }
      formData.value = Object.fromEntries(
        aasConnection.value.fieldAssignments
          .map((fm, index) => [
            [aasFieldId(index), aasDropdownValue(fm.idShortParent, fm.idShort)],
            [
              dppFieldId(index),
              dataFieldDropdownValue(fm.sectionId, fm.dataFieldId),
            ],
          ])
          .flat(),
      );
      return formData;
    };

    const addFieldAssignmentRow = () => {
      const newIndex = lastRowIndex.value + 1;
      if (lastRowIndex.value > 0) {
        formSchema.value.push(horizontalLine());
      }
      formSchema.value.push(newFieldAssignmentRow(newIndex));
      lastRowIndex.value = newIndex;
      return formSchema.value;
    };

    const submitModifications = async () => {
      if (aasConnection.value) {
        const fieldAssignments = Object.entries(formData.value)
          .map(([key, value]) => {
            const [source, keyIndex] = key.split("-");
            if (source === "aas") {
              const ddpField = formData.value[`dpp-${keyIndex}`];
              if (!ddpField) {
                return undefined;
              }
              const aasValues = aasDropdownValueToAasId(value);
              const dppValues = dataFieldDropdownValueToDppId(ddpField);
              return {
                dataFieldId: dppValues.dataFieldId,
                sectionId: dppValues.sectionId,
                idShortParent: aasValues.parentIdShort,
                idShort: aasValues.idShort,
              };
            } else {
              return undefined;
            }
          })
          .filter((a) => a !== undefined);

        const response = await apiClient.aasIntegration.modifyConnection(
          aasConnection.value.id,
          {
            name: aasConnection.value.name,
            modelId: aasConnection.value.modelId,
            fieldAssignments,
          },
        );
        aasConnection.value = response.data;
      }
    };

    // const switchModel = async (modelId: string) => {
    //   const model = (await apiClient.models.getModelById(modelId)).data;
    //   if (aasConnection.value && model.productDataModelId) {
    //     aasConnection.value.modelId = model.id;
    //     aasConnection.value.dataModelId = model.productDataModelId;
    //     await apiClient.aasIntegration.modifyConnection(
    //       aasConnection.value.id,
    //       {
    //         name: aasConnection.value.name,
    //         modelId: aasConnection.value.modelId,
    //         fieldAssignments: aasConnection.value.fieldAssignments,
    //       },
    //     );
    //     await updateProductDataModelOptions();
    //   }
    // };

    const updateProductDataModelOptions = async () => {
      if (aasConnection.value) {
        const productDataModelResponse =
          await apiClient.productDataModels.getProductDataModelById(
            aasConnection.value.dataModelId,
          );
        const productDataModel = productDataModelResponse.data;

        productDataModelOptions.value = productDataModel.sections
          .filter(
            (s) =>
              (s.granularityLevel === granularityLevel ||
                !s.granularityLevel) &&
              s.type === SectionType.GROUP,
          )
          .map((section) => ({
            group: section.name,
            options: section.dataFields
              .filter((d) => d.granularityLevel === granularityLevel)
              .map((field) => ({
                label: field.name,
                value: dataFieldDropdownValue(section.id, field.id),
              })),
          }));
      }
    };

    const fetchConnection = async (id: string) => {
      fetchInFlight.value = true;
      const response = await apiClient.aasIntegration.getConnection(id);
      aasConnection.value = response.data;

      if (aasConnection.value) {
        const propertiesResponse =
          await apiClient.aasIntegration.getPropertiesOfAas(
            aasConnection.value.aasType,
          );
        const properties = propertiesResponse.data;
        aasProperties.value = Object.entries(
          groupBy(properties, "parentIdShort"),
        ).map(([parentIdShort, props]) => ({
          group: parentIdShort,
          options: props.map((prop) => ({
            label: prop.property.idShort,
            value: aasDropdownValue(parentIdShort, prop.property.idShort),
            property: prop.property,
          })),
        }));
        await updateProductDataModelOptions();
      }
      initializeFormData();
      initializeFormSchema();
      fetchInFlight.value = false;
    };

    return {
      aasConnection,
      fetchConnection,
      fetchInFlight,
      submitModifications,
      addFieldAssignmentRow,
      formData,
      formSchema,
    };
  },
);
