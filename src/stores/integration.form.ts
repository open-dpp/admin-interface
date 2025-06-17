import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../lib/api-client";
import { AasMappingDto } from "@open-dpp/api-client";
import { z } from "zod";
import { flatMap, get, groupBy } from "lodash";
import { semitrailer } from "../view/integrations/semitrailer";

const AASPropertySchema = z.object({
  idShort: z.string(),
  value: z.ostring(),
  valueType: z.string().default("xs:string"),
  modelType: z.literal("Property"),
});

type AasProperty = z.infer<typeof AASPropertySchema>;

const AASPropertyWithParentSchema = z.object({
  parentIdShort: z.string(),
  property: AASPropertySchema,
});

const collectPropertiesWithParent = (
  elements: any[],
  parentIdShort: string | null = null,
): { parentIdShort: string | null; property: AasProperty }[] => {
  return flatMap(elements, (el) => {
    const isProperty = get(el, "modelType") === "Property";
    const nested = el.value
      ? collectPropertiesWithParent(el.value, el.idShort || null)
      : [];

    return isProperty ? [{ parentIdShort, property: el }, ...nested] : nested;
  });
};

const allProperties = AASPropertyWithParentSchema.array().parse(
  flatMap(semitrailer.submodels, (submodel) =>
    collectPropertiesWithParent(
      submodel.submodelElements || [],
      submodel.idShort,
    ),
  ),
);

const groupedProperties = Object.entries(
  groupBy(allProperties, "parentIdShort"),
).map(([parentIdShort, props]) => ({
  group: parentIdShort,
  options: props.map((prop) => ({
    label: prop.property.idShort,
    value: aasDropdownValue(parentIdShort, prop.property.idShort),
    property: prop.property,
  })),
}));

function aasDropdownValue(parentIdShort: string, idShort: string) {
  return [parentIdShort, idShort].join("/");
}

export const useIntegrationFormStore = defineStore("integration", () => {
  const aasMapping = ref<AasMappingDto>();

  const getFormSchema = () => {
    return aasMapping.value?.fieldMappings.map((fm, index) => ({
      $formkit: "select",
      label: `${index + 1}. Feld aus der Asset Administration Shell`,
      name: `aas ${index}`,
      options: groupedProperties,
    }));
  };

  const getFormData = () => {
    if (!aasMapping.value) {
      return {};
    }
    return Object.fromEntries(
      aasMapping.value.fieldMappings.map((fm, index) => [
        `aas ${index}`,
        aasDropdownValue(fm.idShortParent, fm.idShort),
      ]),
    );
  };

  const fetchMapping = async (id: string) => {
    const response = await apiClient.aasMappings.getMapping(id);
    aasMapping.value = response.data;
  };

  return {
    aasMapping,
    fetchMapping,
    getFormSchema,
    getFormData,
  };
});
