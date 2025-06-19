import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../lib/api-client";
import { groupBy } from "lodash";
import { AasConnectionDto, AasPropertyDto } from "@open-dpp/api-client";

function aasDropdownValue(parentIdShort: string, idShort: string) {
  return [parentIdShort, idShort].join("/");
}

export const useAasConnectionFormStore = defineStore(
  "aas-connection-form",
  () => {
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

    const getFormSchema = () => {
      return aasConnection.value?.fieldAssignments.map((fm, index) => ({
        $formkit: "select",
        label: `${index + 1}. Feld aus der Asset Administration Shell`,
        name: `aas ${index}`,
        options: aasProperties.value,
      }));
    };

    const getFormData = () => {
      if (!aasConnection.value) {
        return {};
      }
      return Object.fromEntries(
        aasConnection.value.fieldAssignments.map((fm, index) => [
          `aas ${index}`,
          aasDropdownValue(fm.idShortParent, fm.idShort),
        ]),
      );
    };

    const fetchMapping = async (id: string) => {
      const response = await apiClient.aasIntegration.getConnection(id);
      aasConnection.value = response.data;

      if (aasConnection.value) {
        const propertiesResponse =
          await apiClient.aasIntegration.getPropertiesOfAas(
            aasConnection.value?.aasType,
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
      }
    };

    return {
      aasConnection,
      fetchMapping,
      getFormSchema,
      getFormData,
    };
  },
);
