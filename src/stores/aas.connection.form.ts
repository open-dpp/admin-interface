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
import { z } from "zod/v4";

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

export const useAasConnectionFormStore = defineStore(
  "aas-connection-form",
  () => {
    const granularityLevel = GranularityLevel.ITEM;
    const fetchInFlight = ref<boolean>(false);
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

    const getFormSchema = () => {
      return aasConnection.value?.fieldAssignments
        .map((fm, index) => [
          {
            $formkit: "select",
            label: `${index + 1}. Feld aus der Asset Administration Shell`,
            name: `aas-${index}`,
            options: aasProperties.value,
            "data-cy": `aas-select-${index}`,
          },
          {
            $formkit: "select",
            label: `${index + 1}. Feld aus dem Produktdatenmodell`,
            name: `dpp-${index}`,
            options: productDataModelOptions.value,
            "data-cy": `dpp-select-${index}`,
          },
        ])
        .flat();
    };

    const getFormData = () => {
      if (!aasConnection.value) {
        return {};
      }
      return Object.fromEntries(
        aasConnection.value.fieldAssignments
          .map((fm, index) => [
            [`aas-${index}`, aasDropdownValue(fm.idShortParent, fm.idShort)],
            [
              `dpp-${index}`,
              dataFieldDropdownValue(fm.sectionId, fm.dataFieldId),
            ],
          ])
          .flat(),
      );
    };

    const modifyConnection = async (data: {
      fieldAssignments: Record<string, string>;
    }) => {
      if (aasConnection.value) {
        const AasFieldAssignmentSchema = z.object({
          dataFieldId: z.string(),
          sectionId: z.string(),
          idShortParent: z.string(),
          idShort: z.string(),
        });
        const UpdateAasConnectionSchema = z.object({
          name: z.string(),
          modelId: z.string().nullable(),
          fieldAssignments: AasFieldAssignmentSchema.array(),
        });

        const fieldAssignments = Object.entries(data.fieldAssignments)
          .map(([key, value]) => {
            const [source, keyIndex] = key.split("-");
            if (source === "aas") {
              const ddpField = data.fieldAssignments[`dpp-${keyIndex}`];
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
          UpdateAasConnectionSchema.parse({
            name: aasConnection.value.name,
            modelId: aasConnection.value.modelId,
            fieldAssignments,
          }),
        );
        aasConnection.value = response.data;
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
      fetchInFlight.value = false;
    };

    return {
      aasConnection,
      fetchConnection,
      fetchInFlight,
      modifyConnection,
      getFormSchema,
      getFormData,
    };
  },
);
